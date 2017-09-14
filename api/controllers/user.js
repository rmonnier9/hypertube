import sharp from 'sharp';
import path from 'path';

const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');

/**
 * POST /signin
 * Sign in using email and password.
 */
exports.postSignin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const error = req.validationErrors();

  if (error) {
    return res.send({ error });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.send({ error: info });
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.send({ error: '' });
    });
  })(req, res, next); // <= ??
};

/**
 * POST /signup
 * Create a new local account.
 */

exports.postSignupPicture = (req, res, next) => {
  const { filename } = req.file;
  const { email } = req.headers;

  const oldPath = path.resolve(__dirname, `../uploads/${filename}`);
  const newPath = path.resolve(__dirname, `../uploads/resized/${filename}`);

  sharp(oldPath)
    .resize(240, 240, {
      kernel: sharp.kernel.lanczos2,
      interpolator: sharp.interpolator.nohalo,
    })
    .toFile(newPath);

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.send({ errorPic: 'Account with that email address does not exist.' });
      }
      // verif if the user has already a pic, which, is unlikely => security purpose, to dig
      if (user.profile.picture) {
        return res.send({ errorPic: 'You can\'t upload a new picture here, go to your profile' });
      }
      user.profile.picture = filename;
      user.save((err, user) => {
        if (err) { return next(err); }
        req.logIn(user, (err) => {
          if (err) return next(err);
          return res.send({ errorPic: '' });
        });
      });
    });
};


exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.assert('firstName', 'First name can\'t be more more than 20 letters long').len({ max: 20 });
  req.assert('lastName', 'Last name name can\'t be more more than 20 letters long').len({ max: 20 });
  req.sanitize('creds.email').normalizeEmail({ gmail_remove_dots: false });

  const error = req.validationErrors();

  if (error) {
    return res.send({ error });
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    profile: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      return res.send({ error: [{ param: 'email', msg: 'Account with that email address already exists.' }] });
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.send({ error: '' });
      });
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
    return res.send({ error: '', user });
  });
};

/**
 * GET /islogged
 */
exports.getIslogged = (req, res) => {
  if (req.isAuthenticated()) {
    return res.send({ error: '' });
  }
  res.send({ error: 'You are not logged.' });
};

/**
 * POST /me
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const error = req.validationErrors();

  if (error) {
    return res.send({ error });
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          return res.send({ error: 'The email address you have entered is already associated with an account.' });
        }
        return next(err);
      }
      return res.send({ error: '' });
    });
  });
};

/**
 * GET /profile/:login
 * Profile page.
 */
exports.getAccount = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = '';
    return res.send({ error: '', user });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const error = req.validationErrors();

  if (error) {
    return res.send({ error });
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      return res.send({ error: '' })
    });
  });
};

/**
 * DELETE /me
 * Delete user account.
 */
exports.deleteDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    res.send({ error: '' });
  });
};

/**
 * GET /logout
 * Log out.
 */
exports.signout = (req, res) => {
  req.logout();
  res.send({ error: '' });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(token => token.kind !== provider);
    user.save((err) => {
      if (err) { return next(err); }
        return res.send({ error: '' })
    });
  });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  const error = req.validationErrors();

  if (error) {
    return res.send({ error });
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          return res.send({ error: 'Password reset token is invalid or has expired.' });
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) { return reject(err); }
            resolve(user);
          });
        }));
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Your Hackathon Starter password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        return res.send({ error: '' })
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/'); })
    .catch(err => next(err));
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const error = req.validationErrors();

  if (error) {
    return res.send({ error });
  }

  const createRandomToken = crypto
    .randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = token =>
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.send({ error: 'Account with that email address does not exist.' });
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'hackathon@starter.com',
      subject: 'Reset your password on Hackathon Starter',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        return({ error: '' })
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .catch(next);
};
