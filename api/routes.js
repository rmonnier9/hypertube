import passport from 'passport';
import user from './controllers/user';
import connect from './controllers/connect'; // signup signin
import picture from './controllers/picture';
import passportConfig from './config/passport';


const routes = (app, upload) => {
  /**
   * Primary app routes.
   */
  app.post('/api/signin', connect.postSignin);
  app.post('/api/signup/info', connect.postSignup);
  app.post('/api/signup/upload', upload.single('imageUploaded'), picture.postSignupPicture);
  app.post('/api/forgot', user.postForgot); // not implemented front-end
  app.post('/api/reset/:token', user.postReset); // not implemented front-end

  app.get('/api/islogged', user.getIslogged);

  // Logged part  ====================
  app.use(passportConfig.isAuthenticated);

  app.get('/api/signout', user.signout);
  app.get('/api/me', user.getMyAccount);
  app.post('/api/me', user.postUpdateProfile);
  app.post('/api/profile_pic', upload.single('imageUploaded'), picture.newPicture);
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
};

export default routes;
