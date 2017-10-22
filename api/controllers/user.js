const bluebird = require('bluebird');
const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const { ListComment } = require('../models/Comment');
const mail = require('./mail');
const checkReq = require('./checkReq');

const crypto = bluebird.promisifyAll(require('crypto'));

/**
 * POST /signup/info
 * Create new account and sign in.
 */
exports.postSignup = async (req, res, next) => {
  const error = await checkReq(req);

  if (error.length) {
    return res.send({ error });
  }

  const user = new User({
    email: req.body.email,
    password: req.body.newPassword,
    profile: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      login: req.body.login,
    }
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      return res.send({ error: [{ param: 'email', msg: 'error.emailUsed' }] });
    }
    user.save((err) => {
      if (err) { return next(err); }
      mail.sendWelcomeMail(req.body.email);
      return res.send({ error: [] });
    });
  });
};

/**
 * GET /me
 * Profile page.
 */
exports.getMyAccount = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = '';
    return res.send({ error: [], user });
  });
};

/**
 * POST /me
 * Update profile information.
 */
exports.postUpdateProfile = async (req, res, next) => {
  const { id } = req.body;
  switch (id) {
    case 'name-form': {
      const error = await checkReq(req);

      if (error.length) {
        return res.send({ error });
      }

      User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        if (req.body.firstName.length !== 0) {
          user.profile.firstName = req.body.firstName;
        }
        if (req.body.lastName.length !== 0) {
          user.profile.lastName = req.body.lastName;
        }
        user.save((err) => {
          if (err) { return next(err); }
          user.password = '';
          return res.send({ error: [], user });
        });
      });
      break;
    }

    case 'email-form': {
      const error = await checkReq(req);

      if (error.length) {
        return res.send({ error });
      }

      User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (err) { return next(err); }
          if (isMatch === false) {
            return res.send({ error: [{ param: 'password', msg: 'error.incorrectPassword' }] });
          }
          user.email = req.body.email;
          user.save((err) => {
            if (err) {
              if (err.code === 11000) {
                return res.send({ error: [{ param: 'email', msg: 'error.emailUsed' }] });
              }
              return next(err);
            }
            user.password = '';
            return res.send({ error: [], user });
          });
        });
      });
      break;
    }

    case 'password-form': {
      const error = await checkReq(req);

      if (error.length) {
        return res.send({ error });
      }

      User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        user.password = req.body.newPassword;
        user.save((err) => {
          if (err) { return next(err); }
          mail.sendResetPasswordEmail(user);
          return res.send({ error: [], user });
        });
      });

      break;
    }
    default:
      res.status(401).send({ error: [{ param: 'invalid', msg: 'error.invalid', value: req.body.email }] });
  }
};

/**
 * GET /profile/:name
 * Search profiles.
 */
exports.getAccount = (req, res, next) => {
  const { name } = req.params;
  const nameTab = name.split(' ');

  let matchObj;
  if (nameTab.length === 1) {
    const regex = new RegExp(name, 'i');
    matchObj = {
      $or: [
        { 'profile.firstName': regex },
        { 'profile.lastName': regex },
      ],
    };
  } else {
    matchObj = {
      $or: [
        {
          $and: [
            { 'profile.firstName': new RegExp(nameTab[0], 'i') },
            { 'profile.lastName': new RegExp(nameTab[1], 'i') },
          ]
        },
        {
          $and: [
            { 'profile.lastName': new RegExp(nameTab[0], 'i') },
            { 'profile.firstName': new RegExp(nameTab[1], 'i') },
          ],
        }
      ]
    };
  }
  User.find(matchObj, (err, existingUsers) => {
    if (err) { return next(err); }
    if (existingUsers.length === 0) {
      return res.send({ error: [{ param: 'userName', msg: 'error.noUserName' }] });
    }
    existingUsers.forEach((user) => {
      user.password = '';
      user.email = '';
    });
    return res.send({ error: [], users: existingUsers });
  });
};

/**
 * GET /profile/id/:id
 * Other user profile page.
 */
exports.getAccountById = (req, res, next) => {
  // check if id sent is an Object id
  let objectId = req.params.id;
  try {
    objectId = mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res.send({ error: [{ param: 'user', msg: 'error.noUserProfile' }] });
  }

  // check if id sent is associated to a user
  User.findById(objectId, async (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.send({ error: [{ param: 'user', msg: 'error.noUserProfile' }] });
    }
    // get rid of password and email
    user.password = '';
    user.email = '';

    let movies;
    if (!user.profile.movies || user.profile.movies.length === 0) {
      movies = [];
    } else {
      movies = await Movie.find({ idImdb: { $in: user.profile.movies } });
    }

    // get user comments on all movies
    const commentsData = await ListComment.find({ 'comments.idUser': user._id });

    // get movies associated to comments to get their infos
    const movieList = commentsData.map(comment => comment.idImdb);
    const movieListInfo = await Movie.find({ idImdb: { $in: movieList } });
    const comments = commentsData.map((comment) => {
      const movie = movieListInfo.find(movie => movie.idImdb === comment.idImdb);
      return ({
        idImdb: comment.idImdb,
        comments: comment.comments.filter(comment => (comment.idUser == user._id)),
        thumb: movie.thumb,
        title: movie.title,
      });
    });
    // get latest comments first
    comments.reverse();
    return res.send({ error: [], user, movies, comments });
  });
};

/**
 * DELETE /me
 * Delete user account. // not implemented
 */
exports.deleteDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    res.send({ error: '' });
  });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = async (req, res, next) => {
  const error = await checkReq(req);

  if (error.length) {
    return res.send({ error });
  }

  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .then((user) => {
      if (!user) {
        return res.send({ error: [{ param: 'token', msg: 'error.noToken' }] });
      }
      user.password = req.body.newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.save((err) => {
        if (err) { return next(err); }
        mail.sendResetPasswordEmail(user);
        return res.send({ error: [] });
      });
    })
    .catch(err => next(err));
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = async (req, res, next) => {
  const error = await checkReq(req);

  if (error.length) {
    return res.send({ error });
  }

  const createRandomToken = crypto
    .randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = (token) => {
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.send({ error: [{ param: 'email', msg: 'error.noEmailUsed' }] });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user.save((err) => {
          if (err) { return next(err); }
          const header = req.headers['x-forwarded-host'] || req.headers.host;
          mail.sendForgotPasswordEmail(user, header);
          return res.send({ error: [] });
        });
      });
  };

  createRandomToken
    .then(setRandomToken)
    .catch(err => next(err));
};
