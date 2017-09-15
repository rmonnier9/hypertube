import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SignupComponent = props => (
  <div className="signin">
    <h2 className="form-signin-heading">Sign up</h2>
    <form
      onSubmit={props.handleSubmit}
      onChange={props.handleChange}
    >
      <input
        type="email"
        name="email"
        placeholder="email"
        onChange={props.handleChange}
        required
      /><br />
      <input
        type="password"
        name="password"
        placeholder="password"
        onChange={props.handleChange}
        required
      /><br />
      <input
        type="password"
        name="confirmPassword"
        placeholder="confirm password"
        onChange={props.handleChange}
        required
      /><br />
      <input
        type="submit"
      />
    </form>
    <Link to="/signin">Already member ?</Link>
  </div>
  );

SignupComponent.PropTypes = {
  handleSubmit: PropTypes.func.required,
  handleChange: PropTypes.func.required,
};

export default SignupComponent;
