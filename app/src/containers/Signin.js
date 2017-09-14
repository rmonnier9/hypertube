import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { loginUser } from '../actions/authAction';
import SigninComponent from '../components/SigninComponent2';


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
    error: [],
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value, error: [] });

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const creds = {
      email: email.trim(),
      password: password.trim(),
    };
    this.props.dispatch(loginUser(creds));
  }

  componentWillReceiveProps(nextProps) {
    const { message } = nextProps;
    this.setState({ error: message });
  }

  render() {
    const { isAuthenticated } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { error } = this.state;
    return (
      isAuthenticated ?
        <Redirect to={from} /> :
        <SigninComponent
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          error={error}
        />
    );
  }
});
