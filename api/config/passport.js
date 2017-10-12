import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as FortyTwoStrategy } from 'passport-42';
import User from '../models/User';

const passportConfig = (passport) => {
  /**
   * Sign in using Email and Password.
   */

  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, [{ param: 'email', msg: 'error.noEmailUsed', value: email }]);
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, [{ param: 'password', msg: 'error.incorrectPassword' }]);
      });
    });
  }));

  /**
   * Authenticate JWT in requests headers
   */

  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromHeader('x-access-token');
  opts.secretOrKey = process.env.SESSION_SECRET;

  passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
    User.findById(jwtPayload._id, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) { return done(null, user); }
      return done(null, false);
    });
  }));


  /**
   * OAuth Strategy Overview
   *
   * - User is already logged in.
   *   - Check if there is an existing account with a provider id.
   *     - If there is, return an error message. (Account merging not supported)
   *     - Else link new OAuth account with currently logged-in user.
   * - User is not logged in.
   *   - Check if it's a returning user.
   *     - If returning user, sign in and we are done.
   *     - Else check if there is an existing account with user's email.
   *       - If there is, return an error message.
   *       - Else create a new account.
   */

  /**
  * Sign in with 42.
  */

  passport.use('42', new FortyTwoStrategy({
    clientID: process.env.FORTYTWO_ID,
    clientSecret: process.env.FORTYTWO_SECRET,
    callbackURL: '/oauth/42/callback',
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ fortytwo: profile.id }, (err, existingUser) => {
      if (err) return done(err);
      if (existingUser) return done(null, existingUser);
      User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
        if (err) return done(err);
        if (existingEmailUser) return done('email already used');
        const user = new User();
        user.email = profile.emails[0].value;
        user.fortytwo = profile.id;
        user.tokens.push({ kind: '42', accessToken });
        user.profile.firstName = profile.name.givenName;
        user.profile.lastName = profile.name.familyName;
        user.profile.pictureURL = profile.photos[0].value;
        user.save((err) => {
          done(err, user);
        });
      });
    });
  }));

  /**
   * Sign in with Google.
   */
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: '/oauth/google/callback',
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    User.findOne({ google: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) return done(null, existingUser);
      User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
        if (err) return done(err);
        if (existingEmailUser) {
          existingEmailUser.google = profile.id;
          existingEmailUser.tokens.push({ kind: 'google', accessToken });
          existingEmailUser.save((err) => {
            done(err, existingEmailUser);
          });
        } else {
          const user = new User();
          user.email = profile.emails[0].value;
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken });
          user.profile.firstName = profile.name.givenName;
          user.profile.lastName = profile.name.familyName;
          user.profile.gender = profile._json.gender;
          user.profile.pictureURL = profile._json.image.url;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }));
};

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

export default passportConfig;
