import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import SignupComponent from '../components/SignupComponent.js';

import { loginUser } from '../../actions/authAction';
import '../css/homepage.css';

class Signup extends Component {

  state = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    login: '',
    error: [{ param: '', msg: '' }],
    errorPic: [{ param: '', msg: '' }],
    status: 'closed',
    file: {},
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value, error: [{ param: '', msg: '' }] });
  }

  imageUpload = (file) => { this.setState({ file }); }

  handleNextStep = (e) => {
    e.preventDefault();
    this.setState({ status: 'open' });
  }

  sendPicture = (file) => {
    const form = new FormData();
    form.append('imageUploaded', file);
    const headers = { 'Content-Type': 'multipart/form-data', email: this.state.email };
    const config = {
      url: '/api/signup/upload',
      method: 'POST',
      data: form,
      headers,
    };
    return axios(config);
  }

  sendInfo = (data) => {
    const config = {
      url: '/api/signup/info',
      method: 'POST',
      data,
    };
    return axios(config);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password, confirmPassword, firstName, lastName, login, file } = this.state;
    const data = {
      email: email.trim(),
      newPassword: password.trim(),
      confirmPassword: confirmPassword.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      login: login.trim(),
    };
    this.sendInfo(data)
      .then(({ data: { error } }) => {
        if (error.length) this.setState({ status: 'closed', error });
        else {
          this.sendPicture(file)
            .then(({ data: { errorPic } }) => {
              if (errorPic.length) this.setState({ status: 'open', errorPic });
              else {
                this.setState({ status: 'closed' });
                this.props.dispatch(loginUser({
                  email,
                  password,
                }));
                this.props.history.push('/');
              }
            });
        }
      });
  }

  render() {
    return (
      <SignupComponent
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        error={this.state.error}
        status={this.state.status}
        file={this.state.file}
        handleUpload={this.imageUpload}
        handleNextStep={this.handleNextStep}
        errorPic={this.state.errorPic}
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
