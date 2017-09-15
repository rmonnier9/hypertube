import React from 'react';
import { Link } from 'react-router-dom';

const SignOutMenu = props => (
  <button
    onClick={props.handleSignOut}
  >
  Signout
  </button>
);

export default class NavBar extends React.Component {
  render() {
    return (
      <div>
        <button><Link to="/myprofile">To profile</Link></button>
        <button><Link to="/">To Gallery</Link></button>
        <SignOutMenu
          handleSignOut={this.props.handleSignOut}
        />
      </div>
    );
  }
}
