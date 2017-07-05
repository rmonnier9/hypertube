/**
 * Controllers (route handlers).
 */
import * as homeController from './controllers/home';
import * as userController from './controllers/user';
import * as apiController from './controllers/api';
import * as contactController from './controllers/contact';
import * as passport from 'passport';

/**
 * API keys and Passport configuration.
 */
import * as passportConfig from './config/passport';
/**
 * Primary app routes.
 */

const routes = (app) => {

  /**
   * API examples routes.
   */
  app.get('/api', apiController.getApi)
  .get('/api/facebook',
       passportConfig.isAuthenticated,
       passportConfig.isAuthorized,
       apiController.getFacebook)
  /**
   * OAuth authentication routes. (Sign in)
   */
  .get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))
  .get('/auth/facebook/callback',
       passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
         res.redirect(req.session.returnTo || '/');
       })
  .get('/', homeController.index)
  .get('/login', userController.getLogin)
  .post('/login', userController.postLogin)
  .get('/logout', userController.logout)
  .get('/forgot', userController.getForgot)
  .post('/forgot', userController.postForgot)
  .get('/reset/:token', userController.getReset)
  .post('/reset/:token', userController.postReset)
  .get('/signup', userController.getSignup)
  .post('/signup', userController.postSignup)
  .get('/contact', contactController.getContact)
  .post('/contact', contactController.postContact)
  // Logged part  ====================
  .use('/api', passportConfig.isAuthenticated)
  .get('/account', userController.getAccount)
  .post('/account/profile', userController.postUpdateProfile)
  .post('/account/password', userController.postUpdatePassword)
  .post('/account/delete', userController.postDeleteAccount)
  .get('/account/unlink/:provider', userController.getOauthUnlink);
};

export default routes;
