import React, { Component } from 'react';
import TextInput from '../../General/components/TextInput.js';
import SubmitForm from '../../General/components/SubmitForm.js';
import FormClass from './FormClass.js';

class MyInfosForms extends Component {

  state = {
    emailForm: false,
    nameForm: false,
    passwordForm: false,
  }

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
    const { emailForm, nameForm, passwordForm } = this.state;
    if (id === 'email') {
      this.setState({ emailForm: !emailForm, nameForm: false, passwordForm: false });
    } else if (id === 'name') {
      this.setState({ emailForm: false, nameForm: !nameForm, passwordForm: false });
    } else if (id === 'password') {
      this.setState({ emailForm: false, nameForm: false, passwordForm: !passwordForm });
    }
    this.props.onChange('error', [{ param: '', msg: '', value: '' }]);
  }

  render() {
    const { error, change, user } = this.props;
    const errorMessage = error[0].msg;
    const email = change.email !== '' ? change.email : user.email;
    const firstName = change.firstName !== '' ? change.firstName : user.profile.firstName;
    const lastName = change.lastName !== '' ? change.lastName : user.profile.lastName;

    const emailForm = {
      onChange: this.passChange,
      onSubmit: this.handleSubmit,
      formId: 'email-form',
      fieldNb: 2,
      values: [email, ''],
      name: ['email', 'password'],
      type: ['text', 'password'],
      text: ['New contact email', 'Confirm change with password'],
    };
    const nameForm = {
      onChange: this.passChange,
      onSubmit: this.handleSubmit,
      formId: 'name-form',
      // fieldNb: 2,
      values: [firstName, lastName],
      // name: ['firstName', 'lastName'],
      type: ['text', 'text'],
      text: ['First name', 'Last name'],
    };
    const passwordForm = {
      onChange: this.passChange,
      onSubmit: this.handleSubmit,
      formId: 'password-form',
      fieldNb: 2,
      values: ['', ''],
      name: ['password', 'confirmPassword'],
      type: ['password', 'password'],
      text: ['New password', 'Confirm new password'],
    };
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
          <span className="">Change my password</span>
          <button id="password" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        <FormClass status={this.state.emailForm} data={emailForm} />
        <FormClass status={this.state.nameForm} data={nameForm} />
        <FormClass status={this.state.passwordForm} data={passwordForm} />
        <div style={{ color: 'red' }}>{errorMessage}</div>
      </div>
    );
  }
}

export default MyInfosForms;
