import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { loginUser } from '../../actions/authAction';
import SigninComponent from '../components/SigninComponent.js';
import '../css/homepage.css';

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
    error: [{ param: '', msg: '' }],
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value, error: [{ param: '', msg: '' }] })
  };

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
    if (message !== undefined) {
      this.setState({ error: message });
    }
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
