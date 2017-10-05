import axios from 'axios';
import React, { Component } from 'react';
import InputForgot from '../components/InputForgot.js';
// import '../css/forgot.css';

class Forgot extends Component {

  state = {
    email: '',
    error: [],
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value, error: [] });

  sendMail = (event) => {
    event.preventDefault();
    const { email } = this.state;
    const url = '/api/forgot';
    axios.post(url, { email: email.trim() })
    .then(({ data: { error } }) => {
      this.setState({ error });
    })
    .catch(err => console.error('Error: ', err));
  }

  componentWillReceiveProps(nextProps) {
    const { message } = nextProps;
    this.setState({ error: message });
  }

  render() {
    const { error } = this.state;
    // console.log(error);

    return (
      <div>
        <InputForgot
          handleSubmit={this.sendMail}
          handleChange={this.handleChange}
          error={error}
        />
      </div>
    );
  }
}

export default Forgot;
