import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { loginUser } from '../actions/authAction';
import SigninComponent from '../components/SigninComponent';

export default connect(
  ({ auth: { isAuthenticated, message } }) => ({
    isAuthenticated,
    message,
  }),
)(
class Signin extends Component {

  state = {
    email: '',
    password: '',
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const creds = {
      email: email.trim(),
      password: password.trim(),
    };
    this.props.dispatch(loginUser(creds));
  }

  render() {
    const { isAuthenticated, message } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    return (
      isAuthenticated ?
        <Redirect to={from} /> :
        <SigninComponent
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          message={message}
        />
    );
  }
});
