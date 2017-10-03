import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateLocale } from '../../reducers/i18n';
import '../css/nav.css';

const SignOutMenu = props => (
  <button
    onClick={props.handleSignOut}
    className="glyphicon glyphicon-off"
  />
);

class NavBar extends Component {
  render() {
    return (
      <nav className="navbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <div className="navbar-brand">
              Hypertube
            </div>
          </div>
          <ul className="nav navbar-nav">
            <li className="nav-link">
              <Link to="/myprofile">My profile</Link>
            </li>
            <li className="nav-link">
              <Link to="/">Gallery</Link>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li className="nav-link">
              <button className="nav-lang" onClick={() => this.props.onLocaleChange('fr-fr')}>FR</button>
            </li>
            <li className="nav-link">
              <button className="nav-lang" onClick={() => this.props.onLocaleChange('en-en')}>EN</button>
            </li>
            <li className="nav-link">
              <SignOutMenu
                handleSignOut={this.props.handleSignOut}
              />
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => (
  { locale: state.i18n.locale }
);

const mapDispatchToProps = dispatch => (
  { onLocaleChange: updateLocale({ dispatch }) }
);

// Use default export for the connected component (for app)
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
