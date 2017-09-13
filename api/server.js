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
import dotenv from 'dotenv/config';
const MongoStore = require('connect-mongo')(session);
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import expressValidator from 'express-validator';
import expressStatusMonitor from 'express-status-monitor';
import multer from 'multer';

/**
 * multer configuration
 */

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Controllers (route handlers).
 */
import userController from './controllers/user';

/**
 * API keys and Passport configuration.
 */
import passportConfig from './config/passport';

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
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
app.use(expressStatusMonitor());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

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
app.get('/api/me', userController.getAccount);
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
 * Error Handler.
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
