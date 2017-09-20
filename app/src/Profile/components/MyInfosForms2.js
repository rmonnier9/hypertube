import React, { Component } from 'react';
import TextInput from '../../General/components/TextInput.js';
import SubmitForm from '../../General/components/SubmitForm.js';
import FormClass from './FormClass.js';

class MyInfosForms extends Component {

  state = {
    formIndex: false,
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const id = event.target.id;
    this.props.onSubmit(id);
  }

  passChange = (name, value) => {
    this.props.onChange(name, value);
  }

  getForm = (formIndex) => {
    const { user } = this.props;
    const forms = [
      {
        formId: 'name-form',
        name: ['firstName', 'lastName'],
        type: ['text', 'text'],
        text: ['First name', 'Last name'],
        values: [user.profile.firstName, user.profile.lastName],
      },
      {
        formId: 'email-form',
        name: ['email', 'password'],
        type: ['text', 'password'],
        text: ['New contact email', 'Confirm change with password'],
        values: [user.email, ''],
      },
      {
        formId: 'password-form',
        name: ['password', 'confirmPassword'],
        type: ['password', 'password'],
        text: ['New password', 'Confirm new password'],
        values: ['', ''],
      },
    ];
    return forms[formIndex];
  }

  handleClick = (index) => {
    //event.preventDefault();
    // const id = event.target.id;
    // const { emailForm, nameForm, passwordForm } = this.state;
    // if (id === 'email') {
    //   this.setState({ emailForm: !emailForm, nameForm: false, passwordForm: false });
    // } else if (id === 'name') {
    //   this.setState({ emailForm: false, nameForm: !nameForm, passwordForm: false });
    // } else if (id === 'password') {
    //   this.setState({ emailForm: false, nameForm: false, passwordForm: !passwordForm });
    // }
    // this.props.onChange('error', [{ param: '', msg: '', value: '' }]);
    this.setState((prevState) => {
      const newState = {};
      if (prevState.formIndex === index) newState.formIndex = false;
      else newState.formIndex = index;
      return newState;
    });
  }

  render() {
    const { error, change, user } = this.props;
    const errorMessage = error[0].msg;
    const email = change.email !== '' ? change.email : user.email;
    const firstName = change.firstName !== '' ? change.firstName : user.profile.firstName;
    const lastName = change.lastName !== '' ? change.lastName : user.profile.lastName;

    const { formIndex } = this.state;
    const form = {
      onChange: this.passChange,
      onSubmit: this.handleSubmit,
      fieldNb: 2,
    };

    if (this.state.formIndex !== false) {
      Object.assign(form, this.getForm(formIndex));
    }
    return (
      <div className="infos-container">
        <div>
          <span className="infos-title"><b>Name</b></span>
          <span>{firstName} {lastName}</span>
          <button id="name" onClick={() => this.handleClick(0)} className="glyphicon glyphicon-pencil" />
        </div>
        <div>
          <span className="infos-title"><b>Contact</b></span>
          <span>{email}</span>
          <button id="email" onClick={() => this.handleClick(1)} className="glyphicon glyphicon-pencil" />
        </div>
        <div>
          <span className="">Change my password</span>
          <button id="password" onClick={() => this.handleClick(2)} className="glyphicon glyphicon-pencil" />
        </div>
        {formIndex !== false ? <FormClass data={form} /> : null}
        <div style={{ color: 'red' }}>{errorMessage}</div>
      </div>
    );
  }
}

export default MyInfosForms;
