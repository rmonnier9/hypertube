import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import * as mail from './mail';
import checkReq from './checkReq';

/**
 * POST /signin
 * Sign in using email and password.
 */
export const postSignin = async (req, res, next) => {
  const error = await checkReq(req);

  if (error.length) {
    return res.send({ error });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    console.log(info);
    if (!user) {
      return res.send({ error: info });
    }
    const token = jwt.sign({ _id: user._id, email: user.email, provider: 'local' }, process.env.SESSION_SECRET);
    const { lang } = user.profile;
    res.set('Access-Control-Expose-Headers', 'x-access-token');
    res.set('x-access-token', token);
    res.set('lang-user', lang);
    res.send({ error: '' });
  })(req, res, next);
};


/**
 * POST /signup/info
 * Create new account and sign in.
 */
export const postSignup = async (req, res, next) => {
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
