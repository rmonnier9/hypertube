import React, { Component } from 'react';
import TextInput from '../../General/components/TextInput';
import SubmitForm from '../../General/components/SubmitForm';

class MyInfosForms extends Component {

  handleSubmit = (event) => {
    event.preventDefault();
    const id = event.target.id;
    this.props.onSubmit(id);
  }

  passChange = (name, value) => {
    this.props.onChange(name, value);
  }

  handleClick = (event) => {
    event.preventDefault();
    const id = event.target.id;
    if (id === 'email') {
      this.props.onChange('forms', { email: true, name: false, password: false });
    } else if (id === 'name') {
      this.props.onChange('forms', { email: false, name: true, password: false });
    } else if (id === 'password') {
      this.props.onChange('forms', { email: false, name: false, password: true });
    }
    this.props.onChange('error', [{ param: '', msg: '', value: '' }]);
  }

  render() {
    const { forms, error, change, user } = this.props;
    const errorMessage = error[0].msg;
    const email = change.email !== '' ? change.email : user.email;
    const firstName = change.firstName !== '' ? change.firstName : user.profile.firstName;
    const lastName = change.lastName !== '' ? change.lastName : user.profile.lastName;

    let formEmail;
    let formName;
    let formPassword;
    if (forms.email) {
      formEmail = (
        <form id="email-form" onSubmit={this.handleSubmit}>
          <TextInput
            currentValue={email}
            name="email"
            type="email"
            text="New contact email"
            onChange={this.passChange}
          />
          <TextInput
            currentValue=""
            name="password"
            type="password"
            text="Confirm change with password"
            onChange={this.passChange}
          />
          <SubmitForm value="Save" />
        </form>
      );
    } else if (forms.name) {
      formName = (
        <form id="name-form" onSubmit={this.handleSubmit}>
          <TextInput
            currentValue={firstName}
            name="firstName"
            type="text"
            text="First name"
            onChange={this.passChange}
          />
          <TextInput
            currentValue={lastName}
            name="lastName"
            type="text"
            text="Last name"
            onChange={this.passChange}
          />
          <SubmitForm value="Save" />
        </form>
      );
    } else if (forms.password) {
      formPassword = (
        <form id="password-form" onSubmit={this.handleSubmit}>
          <TextInput
            currentValue=""
            name="password"
            type="password"
            text="New password"
            onChange={this.passChange}
          />
          <TextInput
            currentValue=""
            name="confirmPassword"
            type="password"
            text="Confirm new password"
            onChange={this.passChange}
          />
          <SubmitForm value="Save" />
        </form>
      );
    }

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
        <div>
          <span className="infos-password">Change my password</span>
          <button id="password" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        {formEmail}
        {formName}
        {formPassword}
        <div style={{ color: 'red' }}>{errorMessage}</div>
      </div>
    );
  }
}

export default MyInfosForms;
