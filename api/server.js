/**
 * Module dependencies.
 */
import express from 'express';
import compression from 'compression';
import session from 'express-session';
import bodyParser from 'body-parser';
import logger from 'morgan';
import chalk from 'chalk';
import errorHandler from 'errorhandler';
import lusca from 'lusca';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import expressValidator from 'express-validator';
import expressStatusMonitor from 'express-status-monitor';
import multer from 'multer';
import dotenv from 'dotenv/config';

/**
* Controllers (route handlers).
*/
import userController from './controllers/user';

/**
* API keys and Passport configuration.
*/
import passportConfig from './config/passport';

// stores sessions in the "sessions" collection by default. See if user is loggedin (passport).
const MongoStore = require('connect-mongo')(session);

/**
 * multer configuration
 */
const upload = multer({ dest: path.join(__dirname, 'uploads/tmp') });

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise; // Use native promises (vs bluebird...) (?)
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8000);
app.use(expressStatusMonitor()); // report realtime server metrics for Express-based node servers ?
app.use(compression()); // reduce page loads time to the order of 15-20%
app.use(logger('dev')); // morgan
app.use('/static', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator()); // validate form inputs. cf req.assert in controllers files
// express-session: sends a session ID over cookies to the client
app.use(session({
  resave: true, // automatically write to the session store
  saveUninitialized: true, // saved new sessions
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe('SAMEORIGIN')); // lusca = security middleware
app.use(lusca.xssProtection(true));

/**
 * Primary app routes.
 */
app.post('/api/signin', userController.postSignin);
app.post('/api/signup/info', userController.postSignup);
app.post('/api/signup/upload', upload.single('imageUploaded'), userController.postSignupPicture);
app.post('/api/forgot', userController.postForgot);
app.post('/api/reset/:token', userController.postReset);

app.get('/api/islogged', userController.getIslogged);

// Logged part  ====================
app.use(passportConfig.isAuthenticated);

app.get('/api/signout', userController.signout);
app.get('/api/me', userController.getMyAccount);
app.post('/api/me');
app.delete('/api/me');
app.get('/api/profile/:login');

app.get('/api/search');
app.get('/api/movie/:id');
app.post('/api/movie/:id');

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/api/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

/**
 * Error Handler. only use in development
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
