const user = require('./controllers/user');
const movie = require('./controllers/movie');
const authentication = require('./controllers/authentication');
const picture = require('./controllers/picture');
const search = require('./controllers/search');
const comment = require('./controllers/comment');
const genre = require('./controllers/scraper/genreCount');
const video = require('./controllers/video');
const deleteOne = require('./controllers/video/deleter');

const routes = async (app, passport, upload) => {
  /**
   * Authentication routes. (Sign in)
   */
  app.post('/api/signin', authentication.local);
  app.get('/api/auth/42', passport.authenticate('42'));
  app.get('/api/auth/42/callback', authentication.fortytwo);
  app.get('/api/auth/google', passport.authenticate('google', { scope: 'profile email' }));
  app.get('/api/auth/google/callback', authentication.google);
  app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  app.get('/api/auth/facebook/callback', authentication.facebook);
  app.get('/api/auth/github', passport.authenticate('github'));
  app.get('/api/auth/github/callback', authentication.github);
  app.get('/api/auth/linkedin', passport.authenticate('linkedin'));
  app.get('/api/auth/linkedin/callback', authentication.linkedin);
  app.use('/oauth', (req, res) => {
    res.end();
  });

  /**
   * Unlogged routes.
   */
  app.post('/api/signup/info', user.postSignup);
  app.post('/api/signup/upload', upload.single('imageUploaded'), picture.postSignupPicture);
  app.post('/api/forgot', user.postForgot);
  app.post('/api/reset/:token', user.postReset);
  app.get('/api/movie/stream/:idImdb/:hash', video.checker, video.streamer);


  /**
   * Logged routes. (Sign in)
   */
  app.use('/api', passport.authenticate('jwt', { session: false }));
  app.get('/api/movie/startTorrent/:idImdb/:hash', video.checker, video.startTorrent);
  app.get('/api/movie/getStatus/:idImdb/:hash', video.checker, video.getLoadingStatus);
  app.get('/api/movie/subtitle/:idImdb/:hash', video.getSub);
  app.get('/api/movie/clear/:idImdb/:hash', deleteOne);
  app.get('/api/me', user.getMyAccount);
  app.post('/api/me', user.postUpdateProfile);
  app.delete('/api/me', user.deleteDeleteAccount); // not implemented
  app.post('/api/profile_pic', upload.single('imageUploaded'), picture.newPicture);
  // app.get('/api/profile', user.getAccount);
  app.get('/api/profile/:name', user.getAccount);
  app.get('/api/profile/id/:id', user.getAccountById);
  app.get('/api/movie/info/:idImdb', movie.getInfos);

  app.get('/api/comment/:idImdb', comment.getComment);
  app.post('/api/comment/:idImdb', comment.addComment);

  app.get('/api/genres', genre.getGenreTable);

  app.get('/api/gallery/search', search.getSearch);
};

module.exports = routes;
