import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute.js';

// Components
import NotFound from './General/components/NotFound.js';

// Containers
import Header from './General/components/Header.js';
import MyProfile from './Profile/containers/MyProfile.js';
import Signin from './HomePage/containers/Signin.js';
import Signup from './HomePage/containers/Signup.js';
import Gallery from './Gallery/components/GalleryComponent.js';

const MatchaRouter = ({ isAuthenticated, locale }) => (
  <Router>
    <div>
      <Header />
      <Switch>
        <PrivateRoute exact path="/" isAuthenticated={isAuthenticated} component={Gallery} />
        <PrivateRoute exact path="/myprofile" isAuthenticated={isAuthenticated} component={MyProfile} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
  );

MatchaRouter.propTypes = {
  isAuthenticated: PropTypes.bool,
  locale: PropTypes.string,
};

MatchaRouter.defaultProps = {
  isAuthenticated: false,
  locale: 'en-EN',
};

//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = ({ auth: { isAuthenticated }, i18n: { locale } }) => ({
  isAuthenticated,
  locale,
});

export default connect(mapStateToProps)(MatchaRouter);
