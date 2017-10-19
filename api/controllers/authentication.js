import passport from 'passport';
import jwt from 'jsonwebtoken';
import checkReq from './checkReq';

/**
 * POST /signin
 * Sign in using email and password.
 */
export const local = async (req, res, next) => {
  const error = await checkReq(req);

  if (error.length) {
    return res.send({ error });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.send({ error: info });
    }
    const token = jwt.sign({ _id: user._id, email: user.email, provider: 'local' }, process.env.SESSION_SECRET);
    const { lang } = user.profile;
    res.set('Access-Control-Expose-Headers', 'x-access-token');
    res.set('x-access-token', token);
    res.set('lang-user', lang || 'en-en');
    res.send({ error: '' });
  })(req, res, next);
};

/**
 * GET /api/auth/42/callback
 * Sign in using 42.
 */
export const fortytwo = async (req, res, next) => {
  passport.authenticate('42', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.send({ error: info });
    }
    const token = jwt.sign({ _id: user._id, email: user.email, provider: '42' }, process.env.SESSION_SECRET);
    const { lang } = user.profile;
    res.set('Access-Control-Expose-Headers', 'x-access-token');
    res.set('x-access-token', token);
    res.set('lang-user', lang || 'en-en');
    res.send({ error: '' });
  })(req, res, next);
};

/**
 * GET /api/auth/google/callback
 * Sign in using Google.
 */
export const google = async (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.send({ error: info });
    }
    const token = jwt.sign({ _id: user._id, email: user.email, provider: 'google' }, process.env.SESSION_SECRET);
    const { lang } = user.profile;
    res.set('Access-Control-Expose-Headers', 'x-access-token');
    res.set('x-access-token', token);
    res.set('lang-user', lang || 'en-en');
    res.send({ error: '' });
  })(req, res, next);
};

/**
 * GET /api/auth/facebook/callback
 * Sign in using Facebook.
 */
export const facebook = async (req, res, next) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.send({ error: info });
    }
    const token = jwt.sign({ _id: user._id, email: user.email, provider: 'facebook' }, process.env.SESSION_SECRET);
    const { lang } = user.profile;
    res.set('Access-Control-Expose-Headers', 'x-access-token');
    res.set('x-access-token', token);
    res.set('lang-user', lang || 'en-en');
    res.send({ error: '' });
  })(req, res, next);
};

export const github = (req, res, next) => {
  passport.authenticate('github', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.send({ error: info });
    }
    const token = jwt.sign({ _id: user._id, email: user.email, provider: 'github' }, process.env.SESSION_SECRET);
    const { lang } = user.profile;
    res.set('Access-Control-Expose-Headers', 'x-access-token');
    res.set('x-access-token', token);
    res.set('lang-user', lang || 'en-en');
    res.send({ error: '' });
  })(req, res, next);
};

export const linkedin = (req, res, next) => {
  passport.authenticate('linkedin', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.send({ error: info });
    }
    const token = jwt.sign({ _id: user._id, email: user.email, provider: 'linkedin' }, process.env.SESSION_SECRET);
    const { lang } = user.profile;
    res.set('Access-Control-Expose-Headers', 'x-access-token');
    res.set('x-access-token', token);
    res.set('lang-user', lang || 'en-en');
    res.send({ error: '' });
  })(req, res, next);
};
