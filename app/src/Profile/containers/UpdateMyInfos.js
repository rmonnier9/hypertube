import axios from 'axios';
import React, { Component } from 'react';
import MyInfosForms from '../components/MyInfosForms2.js';

class UpdateMyInfos extends Component {

  state = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    forms: { email: false, name: false, password: false },
    change: { email: '', firstName: '', lastName: '' },
    error: [{ param: '', msg: '', value: '' }],
  }

  saveState = (name, value) => {
    this.setState({ [name]: value });
  }

  postUpdate = (id) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = this.state;
    let infos;
    if (id === 'name-form') {
      infos = { id, firstName, lastName };
    } else if (id === 'email-form') {
      infos = { id, email, password };
    } else if (id === 'password-form') {
      infos = { id, password, confirmPassword };
    }
    const url = '/api/me';
    axios.post(url, infos)
    .then(({ data }) => {
      const { error, user } = data;
      if (error.length !== 0) {
        this.setState({ error, forms: { email: false, name: false, password: false } });
      } else if (id === 'password-form') {
        this.setState({
          error: [{ param: '', msg: '', value: '' }],
          forms: { email: false, name: false, password: false },
        });
      } else {
        this.setState({
          error: [{ param: '', msg: '', value: '' }],
          forms: { email: false, name: false, password: false },
          change: {
            email: user.email,
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
          },
        });
      }
    })
    .catch(err => console.error('Error: ', err));
  }

  render() {
    const { forms, error, change } = this.state;
    const { user } = this.props;

    return (
      <MyInfosForms
        forms={forms}
        user={user}
        error={error}
        change={change}
        onChange={this.saveState}
        onSubmit={this.postUpdate}
      />
    );
  }
}

export default UpdateMyInfos;
