import passport from 'passport';
import User from '../models/User';

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
 * POST /signup/info
 * Create new account and sign in.
 */
exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.assert('firstName', 'First name can\'t be more than 20 letters long').len({ max: 20 });
  req.assert('lastName', 'Last name can\'t be more than 20 letters long').len({ max: 20 });
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
