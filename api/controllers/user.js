import bluebird from 'bluebird';
import mongoose from 'mongoose';
import User from '../models/User';
import * as mail from './mail';
import checkReq from './checkReq';

const crypto = bluebird.promisifyAll(require('crypto'));

/**
 * GET /me
 * Profile page.
 */
export const getMyAccount = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = '';
    return res.send({ error: '', user });
  });
};

/**
 * POST /me
 * Update profile information.
 */
export const postUpdateProfile = async (req, res, next) => {
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
          return res.send({ error: '', user });
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
            return res.send({ error: [{ param: 'password', msg: 'Incorrect password.', value: req.body.password }] });
          }
          user.email = req.body.email;
          user.save((err) => {
            if (err) {
              if (err.code === 11000) {
                return res.send({ error: [{ param: 'email', msg: 'The email address you have entered is already associated with an account.', value: req.body.email }] });
              }
              return next(err);
            }
            user.password = '';
            return res.send({ error: '', user });
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
          return res.send({ error: '', user });
        });
      });

      break;
    }
    default:
      res.status(401).send({ error: 'invalid action requested' });
  }
};

/**
 * GET /profile/:name
 * Search profiles.
 */
export const getAccount = (req, res, next) => {
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
      return res.send({ error: [{ param: 'userName', msg: 'No account with that name.' }] });
    }
    existingUsers.forEach((user) => {
      user.password = '';
      user.email = '';
    });
    return res.send({ error: '', users: existingUsers });
  });
};

/**
 * GET /profile/:id
 * Other user profile page.
 */
export const getAccountById = (req, res, next) => {
  let objectId = req.params.id;
  try {
    objectId = mongoose.Types.ObjectId(req.params.id);
  } catch (err) { return res.send({ error: 'Cannot find a user.' }); }
  User.findById(objectId, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.send({ error: 'Cannot find a user.' });
    }
    user.password = '';
    user.email = '';
    return res.send({ error: '', user });
  });
};

/**
 * DELETE /me
 * Delete user account.
 */
export const deleteDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    res.send({ error: '' });
  });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
export const postReset = async (req, res, next) => {
  const error = await checkReq(req);

  if (error.length) {
    return res.send({ error });
  }

  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .then((user) => {
      if (!user) {
        return res.send({ error: [{ param: 'token', msg: 'Password reset token is invalid or has expired.' }] });
      }
      user.password = req.body.password;
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
export const postForgot = async (req, res, next) => {
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
          return res.send({ error: [{ param: 'email', msg: 'No account with that email.' }] });
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user.save((err) => {
          if (err) { return next(err); }
          const header = req.headers['x-forwarded-host'];
          mail.sendForgotPasswordEmail(user, header);
          return res.send({ error: [] });
        });
      });
  };

  createRandomToken
    .then(setRandomToken)
    .catch(err => next(err));
};
