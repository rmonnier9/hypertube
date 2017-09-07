import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import SignupComponent from '../components/SignupComponent';

import { loginUser } from '../actions/authAction';

class Signup extends Component {
  state = {
    email: '',
    password: '',
    confirmpassword: '',
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })
  handleSubmit = (event) => {
    event.preventDefault();
    const {
      email,
      password,
      confirmPassword,
    } = this.state;
    const data = {
      email,
      password,
      confirmPassword,
    };
    const url = '/api/signup/';
    axios({ url, method: 'POST', data })
    .then(({ data: { error } }) => {
      if (!error) {
        this.props.dispatch(loginUser({
          email: email.trim(),
          password: password.trim(),
        }));
        this.props.history.push('/');
      } else {
        this.setState({ error });
      }
    });
  }

  render() {
    return (
      <SignupComponent
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
      />
    );
  }
}

//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = ({ auth: { isAuthenticated, message } }) => ({
  isAuthenticated,
  message,
});

export default connect(mapStateToProps)(Signup);
