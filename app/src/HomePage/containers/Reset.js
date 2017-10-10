import axios from 'axios';
import React, { Component } from 'react';
import InputReset from '../components/InputReset.js';

class Reset extends Component {

  state = {
    password: '',
    confirmPassword: '',
    successMessage: '',
    error: [{ param: '', msg: '' }],
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value, error: [{ param: '', msg: '' }] })
  };

  resetPassword = (event) => {
    event.preventDefault();
    const token = this.props.location.pathname.split('/').pop();
    const { password, confirmPassword } = this.state;
    const url = `/api/reset/${token}`;
    axios.post(
      url,
      {
        newPassword: password.trim(),
        confirmPassword: confirmPassword.trim(),
      },
    )
    .then(({ data: { error } }) => {
      if (error.length === 0) {
        this.setState({
          error,
          successMessage: 'Your password has been changed. You can now log in.',
        });
      } else {
        this.setState({ error, successMessage: '' });
      }
    })
    .catch(err => console.error('Error: ', err));
  }

  componentWillReceiveProps(nextProps) {
    const { message } = nextProps;
    this.setState({ error: message });
  }

  render() {
    const { error, successMessage } = this.state;

    return (
      <div>
        <InputReset
          handleSubmit={this.resetPassword}
          handleChange={this.handleChange}
          error={error}
          successMessage={successMessage}
        />
      </div>
    );
  }
}

export default Reset;
