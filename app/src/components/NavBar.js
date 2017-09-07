import React from 'react';

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
          <SignOutMenu
            handleSignOut={this.props.handleSignOut}
          />
      </div>
    );
  }
}
