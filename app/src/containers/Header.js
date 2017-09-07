import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authAction';
import NavBar from '../components/NavBar';

class Header extends Component {
  handleSignOut = () => {
    this.props.dispatch(logoutUser());
  }

  render() {
    const { isAuthenticated } = this.props;
    console.log(this.props);
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


//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = ({
  auth: { isAuthenticated },
}) => ({
  isAuthenticated,
});

export default connect(mapStateToProps)(Header);
