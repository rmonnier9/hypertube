import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
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
        id: ['profile.firstName', 'profile.lastName'],
        values: [user.profile.firstName, user.profile.lastName],
      },
      email:
      {
        formId: 'email-form',
        name: ['email', 'password'],
        type: ['text', 'password'],
        id: ['profile.newContact', 'profile.confirmChange'],
        values: [user.email, ''],
      },
      password:
      {
        formId: 'password-form',
        name: ['password', 'confirmPassword'],
        type: ['password', 'password'],
        id: ['profile.newPassword', 'profile.confirmPassword'],
        values: ['', ''],
      },
    };
    return forms[id];
  }

  render() {
    const { error, change, user } = this.props;
    const { form } = this.state;
    const email = change.email !== '' ? change.email : user.email;
    const firstName = change.firstName !== '' ? change.firstName : user.profile.firstName;
    const lastName = change.lastName !== '' ? change.lastName : user.profile.lastName;

    const login = user.profile.login || '';
    const logIn = login ? this.props.intl.formatMessage({ id: 'homepage.login' }) : '';

    const displayForm = form.formId === null ? null : (
      <div className="infos-form top">
        <FormClass
          form={form}
          onChange={this.passChange}
          onSubmit={this.handleSubmit}
        />
      </div>
    );

    const changePassword = this.props.intl.formatMessage({ id: 'profile.changePassword' });
    const name = this.props.intl.formatMessage({ id: 'profile.name' });

    const contact = this.props.intl.formatMessage({ id: 'profile.contact' });
    const errorMessage = error[0].msg ? this.props.intl.formatMessage({ id: error[0].msg }) : '';

    return (
      <div className="infos-container">
        <div>
          <span className="infos-title"><b>
            { logIn }
          </b></span>
          <span>{login}</span>
        </div>
        <div>
          <span className="infos-title"><b>
            { name }
          </b></span>
          <span>{firstName} {lastName}</span>
          <button id="name" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        <div>
          <span className="infos-title">
            { contact }
          </span>
          <span>{email}</span>
          <button id="email" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        <div>
          <span className="infos-password">
            { changePassword }
          </span>
          <button id="password" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        {displayForm}
        <div className="infos-error">{errorMessage}</div>
      </div>
    );
  }
}

export default injectIntl(MyInfosForms);
