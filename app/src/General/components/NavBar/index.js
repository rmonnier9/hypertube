import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateLocale } from '../../../reducers/i18n';

const SignOutMenu = props => (
  <button
    onClick={props.handleSignOut}
  >
  Signout
  </button>
);

class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar">
        <button><Link to="/myprofile">To profile</Link></button>
        <button><Link to="/">To Gallery</Link></button>
        <button onClick={() => this.props.onLocaleChange('fr-fr')}>FR</button>
        <button onClick={() => this.props.onLocaleChange('en-en')}>EN</button>
        <SignOutMenu
          handleSignOut={this.props.handleSignOut}
        />
      </div>
    );
  }
}

const mapStateToProps = state => (
  { locale: state.i18n.locale }
);

const mapDispatchToProps = dispatch => (
  { onLocaleChange: updateLocale({ dispatch }) }
);

// Use named export for unconnected component (for tests)
export { NavBar };

// Use default export for the connected component (for app)
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
