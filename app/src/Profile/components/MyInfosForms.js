import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import FormClass from './FormClass';

class MyInfosForms extends Component {

  state = {
    form: { formId: null },
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const id = event.target.id;
    this.setState({ form: { formId: null } });
    this.props.onSubmit(id);
  }

  passChange = (name, value) => {
    this.props.onChange(name, value);
  }

  handleClick = (event) => {
    event.preventDefault();
    const id = event.target.id;
    const form = this.getForm(id);
    this.setState((prevState) => {
      const newState = {};
      if (prevState.form.formId === `${id}-form`) newState.form = { formId: null };
      else newState.form = form;
      return newState;
    });
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
    const errorMessage = error[0].msg;
    const email = change.email !== '' ? change.email : user.email;
    const firstName = change.firstName !== '' ? change.firstName : user.profile.firstName;
    const lastName = change.lastName !== '' ? change.lastName : user.profile.lastName;
    const data = Object.assign(
      form,
      { onChange: this.passChange },
      { onSubmit: this.handleSubmit },
    );
    const displayForm = form.formId === null ? null : (
      <div className="infos-form top">
        <FormClass
          data={data}
        />
      </div>
    );

    return (
      <div className="infos-container">
        <div>
          <div>
            <span className="infos-password">Change my password</span>
            <button id="password" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
          </div>
          <span className="infos-title"><b>
            <FormattedMessage
              id="profile.name"
              defaultMessage="Name"
            />
          </b></span>
          <span>{firstName} {lastName}</span>
          <button id="name" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        <div>
          <span className="infos-title">
            <b>
              <FormattedMessage
                id="profile.contact"
                defaultMessage="Contact"
              />
            </b>
          </span>
          <span>{email}</span>
          <button id="email" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        {displayForm}
        <div className="infos-error">{errorMessage}</div>
      </div>
    );
  }
}

export default MyInfosForms;
