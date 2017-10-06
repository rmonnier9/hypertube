import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from './Dialog.js';

const SignupComponent = (props) => {
  const error = {};
  props.error.forEach((field) => {
    error[field.param] = field.msg;
  });
  return (
    <div>
      <div className="homepage-background" />
      <div className="homepage-container">
        <form
          onSubmit={props.handleNextStep}
          onChange={props.handleChange}
        >
          <h2 className="homepage-title" >Sign up</h2>
          <TextField
            hintText="Your email"
            name="email"
            errorText={error.email}
            floatingLabelText="Email"
            required
          />
          <br />
          <TextField
            hintText="Your password"
            type="password"
            name="password"
            errorText={error.password}
            floatingLabelText="Password"
            required
          />
          <br />
          <TextField
            hintText="Your password"
            type="password"
            name="confirmPassword"
            errorText={error.confirmPassword}
            floatingLabelText="Confirm password"
            required
          />
          <br />
          <TextField
            hintText="Your first name"
            name="firstName"
            errorText={error.firstName}
            floatingLabelText="First name"
            required
          />
          <br />
          <TextField
            hintText="Your last name"
            name="lastName"
            errorText={error.lastName}
            floatingLabelText="Last name"
            required
          />
          <br />
          <RaisedButton className="homepage-submit" type="submit" name="submit" label="Next" />
          <br />
          <Link to="/signin" className="homepage-linkto">Already member?</Link>
          <Dialog
            preview={props.preview}
            handleUpload={props.handleUpload}
            handleSubmit={props.handleSubmit}
            error={props.errorPic}
            status={props.status}
            file={props.file}
          />
        </form>
      </div>
    </div>
  );
};

SignupComponent.PropTypes = {
  handleSubmit: PropTypes.func.required,
  handleChange: PropTypes.func.required,
  error: PropTypes.array.required,
};

export default SignupComponent;
