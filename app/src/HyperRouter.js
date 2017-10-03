import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

// Components
import NotFound from './General/components/NotFound';

// Containers
import Header from './General/components/Header';
import MyProfile from './Profile/containers/MyProfile';
import Signin from './HomePage/containers/Signin';
import Signup from './HomePage/containers/Signup';
import Gallery from './Gallery/container/Gallery';
import Video from './Video/components/Video';
import Movie from './Movie/containers/Movie';

const MatchaRouter = ({ isAuthenticated, locale }) => (
  <Router>
    <div>
      <Header />
      <Switch>
        <PrivateRoute exact path="/" isAuthenticated={isAuthenticated} component={Gallery} />
        <PrivateRoute exact path="/myprofile" isAuthenticated={isAuthenticated} component={MyProfile} />
        <PrivateRoute exact path="/movie/:idImdb" isAuthenticated={isAuthenticated} component={Movie} />
        <PrivateRoute exact path="/video/:hash" isAuthenticated={isAuthenticated} component={Video} />
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
  locale: 'en-en',
};

//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = ({ auth: { isAuthenticated }, i18n: { locale } }) => ({
  isAuthenticated,
  locale,
});

export default connect(mapStateToProps)(MatchaRouter);
