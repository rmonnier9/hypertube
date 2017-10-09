import axios from 'axios';
import React, { Component } from 'react';
import InputReset from '../components/InputReset.js';

class Reset extends Component {

  state = {
    password: '',
    confirm: '',
    successMessage: '',
    error: [],
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value, error: [] });

  resetPassword = (event) => {
    event.preventDefault();
    const token = this.props.location.pathname.split('/').pop();
    const { password, confirm } = this.state;
    const url = `/api/reset/${token}`;
    axios.post(
      url,
      {
        password: password.trim(),
        confirm: confirm.trim(),
      },
    )
    .then(({ data: { error } }) => {
      console.log(error);
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
