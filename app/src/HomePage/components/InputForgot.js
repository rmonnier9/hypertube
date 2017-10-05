import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const InputForgot = (props) => {
  const error = {};
  props.error.forEach((field) => {
    error[field.param] = field.msg;
  });
  // console.log('error', error);

  return (
    <div>
      <div className="homepage-background" />
      <div className="homepage-container">
        <form
          onSubmit={props.handleSubmit}
          onChange={props.handleChange}
        >
          <h2 className="homepage-title">Forgot password</h2>
          <TextField
            hintText="Your email"
            name="email"
            errorText={error.email}
            floatingLabelText="Email"
          />
          <br />
          <RaisedButton className="homepage-submit" type="submit" name="submit" label="Send" />
        </form>
        <br />
        <Link to="/signin">Back to sign in</Link>
      </div>
    </div>
  );
};

export default InputForgot;
