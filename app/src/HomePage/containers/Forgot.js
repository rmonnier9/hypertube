import axios from 'axios';
import React, { Component } from 'react';
import InputForgot from '../components/InputForgot.js';

class Forgot extends Component {

  state = {
    password: '',
    success: false,
    error: [{ param: '', msg: '' }],
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value, error: [{ param: '', msg: '' }] })
  };

  sendMail = (event) => {
    event.preventDefault();
    const { email } = this.state;
    const url = '/api/forgot';
    axios.post(url, { email: email.trim() })
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
        <InputForgot
          handleSubmit={this.sendMail}
          handleChange={this.handleChange}
          error={error}
          success={success}
        />
      </div>
    );
  }
}

export default Forgot;
