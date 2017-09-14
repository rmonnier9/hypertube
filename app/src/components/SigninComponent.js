import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const SigninComponent = props => (
  <div>
    <form
      onSubmit={props.handleSubmit}
      onChange={props.handleChange}
    >
      <div>
        <h2 className="form-login-heading">Sign in</h2>
        <p>to continue to hypertube</p>
      </div>
      <div role="presentation">
        <div>
          <input
            type="text"
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
            type="submit"
            name="submit"
          />
        </div>
        <div>
          <Link to="/signup">Sign up ?</Link>
          <a target="_new" href="/api/auth/google">Link</a>
        </div>
      </div>
    </form>
  </div>
);

SigninComponent.PropTypes = {
  erro: PropTypes.string.required,
  handleSubmit: PropTypes.func.required,
  handleChange: PropTypes.func.required,
};

export default SigninComponent;
