import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

// Components
import NotFound from './components/NotFound';

// Containers
import Header from './containers/Header';
import MyProfile from './containers/MyProfile';
import Signin from './containers/Signin';
import Signup from './containers/Signup';
import Gallery from './components/GalleryComponent';

const MatchaRouter = ({ isAuthenticated }) => (
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
};

MatchaRouter.defaultProps = {
  isAuthenticated: false,
};

//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps)(MatchaRouter);
