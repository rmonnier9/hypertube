import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const InputReset = (props) => {
  const error = {};
  props.error.forEach((field) => {
    error[field.param] = field.msg;
  });
  const { successMessage } = props;

  return (
    <div>
      <div className="homepage-background" />
      <div className="homepage-container">
        <form
          onSubmit={props.handleSubmit}
          onChange={props.handleChange}
        >
          <h2 className="homepage-title">Change password</h2>
          <TextField
            hintText="Your new password"
            type="password"
            name="password"
            errorText={error.newPassword}
            floatingLabelText="Password"
          />
          <br />
          <TextField
            hintText="Your new password"
            type="password"
            name="confirmPassword"
            errorText={error.confirmPassword}
            floatingLabelText="Confirm password"
          />
          <br />
          <RaisedButton className="homepage-submit" type="submit" name="submit" label="Send" />
        </form>
        <br />
        <div style={{ color: 'green' }}>{successMessage}</div>
        <div style={{ color: 'red' }}>{error.token}</div>
        <br />
        <Link to="/signin" className="homepage-linkto">Log in?</Link>
      </div>
    </div>
  );
};

export default InputReset;
