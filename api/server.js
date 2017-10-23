const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const multer = require('multer');
const cron = require('cron');
const dotenv = require('dotenv/config');
const Movie = require('./models/Movie');

const passportConfig = require('./config/passport');
const routes = require('./routes');

// const movieScraper = require('./controllers/scraper/movieScraper');
//
// try {
//   // movieScraper();
// } catch (e) { console.log(e); }

/**
 * multer configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, 'public/uploads/tmp'));
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});
/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise; // Use native promises (vs bluebird...) (?)
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

const CronJob = cron.CronJob;
const job = new CronJob('0 0 1 1 *', () => {
  Movie.deleteMany({ 'torrents.data.lastSeen': { $lte: new Date(Date.now() - (30 * 24 * 3600 * 1000)) } }, () => { console.log('Unwatched movies deleted.'); });
}, null, true, 'Europe/Paris');
job.start();

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8000);
app.use(compression()); // reduce page loads time to the order of 15-20%
app.use(logger('dev')); // morgan
app.use('/static', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'build'), {
  dotfiles: 'ignore',
  index: false,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator()); // validate form inputs. cf req.assert in controllers files
// app.use(passport.initialize());
passportConfig(passport);
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

// Load routes
routes(app, passport, upload);

/**
 * Error Handler. only use in development
 */

// custom error handling
app.use((err, req, res, next) => { res.end(); });
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
}

// if a request doesn't match a route, send the front app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.export = app;
