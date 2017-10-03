import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authAction';
import NavBar from './NavBar';

class Header extends Component {

  handleSignOut = () => {
    this.props.dispatch(logoutUser());
  }

  render() {
    const { isAuthenticated } = this.props;
    return (
      <header className="header">
        {isAuthenticated &&
          <NavBar
            handleSignOut={this.handleSignOut}
          />
        }
      </header>
    );
  }

}


const mapStateToProps = ({
  auth: { isAuthenticated },
}) => ({
  isAuthenticated,
});

// Use named export for unconnected component (for tests)
// export { Header };

// Use default export for the connected component (for app)
export default connect(mapStateToProps)(Header);
