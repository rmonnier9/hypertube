import React, { Component } from 'react';

export default class UpdateMyInfos extends Component {

  state = {
    changeEmail: false,
    changeName: false,
  }

  handleClick = (event) => {
    const id = event.target.id;
    if (id === 'name') {
      this.setState({ changeName: true });
    } else if (id === 'email') {
      this.setState({ changeEmail: true });
    }
  }

  render() {
    const { firstName, lastName } = this.props.user.profile;
    const { email } = this.props.user;
    // const { changeEmail, changeName } = this.state;

    return (
      <div className="infos-container">
        <div>
          <span className="infos-title"><b>Name</b></span>
          <span>{firstName} {lastName}</span>
          <button id="name" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        <div>
          <span className="infos-title"><b>Contact</b></span>
          <span>{email}</span>
          <button id="email" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
      </div>
    );
  }

}
