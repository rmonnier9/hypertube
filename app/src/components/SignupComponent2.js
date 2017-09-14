import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SigninBackground from '../Images/Signin_background5.jpg';
import Dialog from './Dialog';

const styles = {
  container: {
    margin: 'auto',
    marginTop: '25vh',
    width: '360px',
    padding: '10px 25px 25px 25px',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: '10px',
    backgroundColor: 'white',
    borderColor: '#5f8191',
    position: 'relative',
    zIndex: 1,
    fontFamily: 'Impact, Charcoal, sans-serif',
  },
  background: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: `url(${SigninBackground}) center center`,
    backgroundSize: 'cover',
    opacity: 1,
    width: '100%',
    height: '100%',
  },
  button: {
    margin: '10px 0px',
    borderRadius: '10px',
  },
  centered: {
    textAlign: 'center',
  },
};

const SignupComponent = (props) => {
  const error = {};
  props.error.forEach((field) => {
    error[field.param] = field.msg;
  });
  return (
    <div>
      <div style={styles.background} />
      <div style={styles.container}>
        <form
          style={styles.centered}
          onSubmit={props.handleNextStep}
          onChange={props.handleChange}
        >
          <h2 style={styles.centered} >Sign up</h2>
          <TextField
            hintText="Your email"
            name="email"
            errorText={error.email}
            floatingLabelText="Email"
            required
          /><br />
          <TextField
            hintText="Your password"
            type="password"
            name="password"
            errorText={error.password}
            floatingLabelText="Password"
            required
          /><br />
          <TextField
            hintText="Your password"
            type="password"
            name="confirmPassword"
            errorText={error.confirmPassword}
            floatingLabelText="Confirm password"
            required
          /><br />
          <TextField
            hintText="Your first name"
            name="firstName"
            errorText={error.firstName}
            floatingLabelText="First name"
            required
          /><br />
          <TextField
            hintText="Your last name"
            name="lastName"
            errorText={error.lastName}
            floatingLabelText="Last name"
            required
          /><br />
          <RaisedButton style={styles.button} type="submit" name="submit" label="Next" />
          <br />
          <Link to="/signin">Already member ?</Link>
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
