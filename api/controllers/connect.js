import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import mail from './mail';

/**
 * POST /signin
 * Sign in using email and password.
 */
export const postSignin = async (req, res, next) => {
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const validationObj = await req.getValidationResult();
  const error = validationObj.array();

  if (error.length) {
    return res.send({ error });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.send({ error: info });
    }
    const token = jwt.sign({ _id: user._id, email: user.email, provider: 'local' }, process.env.SESSION_SECRET);
    console.log('user', user);
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
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password must be at least 4 characters long').len({ max: 6 });
  req.checkBody('password', 'Password must contain at least one uppercase, one lowercase and one digit.')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/);
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.checkBody('firstName', 'First name can\'t be more than 20 letters long').len({ max: 20 });
  req.checkBody('lastName', 'Last name can\'t be more than 20 letters long').len({ max: 20 });

  req.sanitize('creds.email').normalizeEmail({ gmail_remove_dots: false });

  const validationObj = await req.getValidationResult();
  const error = validationObj.array();

  if (error.length) {
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
      const subject = 'Hypertube - Account created !';
      const content = 'Welcome to Hypertube !';
      mail(req.body.email, subject, content);
      return res.send({ error: '' });
    });
  });
};
