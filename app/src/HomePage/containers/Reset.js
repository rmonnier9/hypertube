import axios from 'axios';
import React, { Component } from 'react';
import InputReset from '../components/InputReset.js';

class Reset extends Component {

  state = {
    password: '',
    confirmPassword: '',
    success: false,
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
          success: true,
        });
      } else {
        this.setState({ error, success: false });
      }
    })
    .catch(err => console.error('Error: ', err));
  }

  componentWillReceiveProps(nextProps) {
    const { message } = nextProps;
    this.setState({ error: message });
  }

  render() {
    const { error, success } = this.state;

    return (
      <div>
        <InputReset
          handleSubmit={this.resetPassword}
          handleChange={this.handleChange}
          error={error}
          success={success}
        />
      </div>
    );
  }
}

export default Reset;
