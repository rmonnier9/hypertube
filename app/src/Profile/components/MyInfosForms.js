import React, { Component } from 'react';
import FormClass from './FormClass';

class MyInfosForms extends Component {

  state = {
    form: {},
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
    const form = this.getForm(id);
    this.setState({ form });
    // if (id === 'email') {
    //   this.props.onChange('forms', { email: true, name: false, password: false });
    // } else if (id === 'name') {
    //   this.props.onChange('forms', { email: false, name: true, password: false });
    // } else if (id === 'password') {
    //   this.props.onChange('forms', { email: false, name: false, password: true });
    // }
    this.props.onChange('error', [{ param: '', msg: '', value: '' }]);
  }

  getForm = (id) => {
    const { user } = this.props;
    const forms = {
      name:
      {
        formId: 'name-form',
        name: ['firstName', 'lastName'],
        type: ['text', 'text'],
        text: ['First name', 'Last name'],
        values: [user.profile.firstName, user.profile.lastName],
      },
      email:
      {
        formId: 'email-form',
        name: ['email', 'password'],
        type: ['text', 'password'],
        text: ['New contact email', 'Confirm change with password'],
        values: [user.email, ''],
      },
      password:
      {
        formId: 'password-form',
        name: ['password', 'confirmPassword'],
        type: ['password', 'password'],
        text: ['New password', 'Confirm new password'],
        values: ['', ''],
      },
    };
    return forms[id];
  }


  render() {
    const { error, change, user } = this.props;
    const { form } = this.state;
    console.log(form);
    const errorMessage = error[0].msg;
    const email = change.email !== '' ? change.email : user.email;
    const firstName = change.firstName !== '' ? change.firstName : user.profile.firstName;
    const lastName = change.lastName !== '' ? change.lastName : user.profile.lastName;

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
        {form !== {} ? <FormClass data={form} /> : null}
        <div style={{ color: 'red' }}>{errorMessage}</div>
      </div>
    );
  }
}

export default MyInfosForms;
