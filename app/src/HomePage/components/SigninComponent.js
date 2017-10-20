import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import logo42 from '../images/42_Logo.png';

const SigninComponent = (props) => {
  const error = {};
  props.error.forEach((field) => {
    if (field.msg) {
      error[field.param] = props.intl.formatMessage({ id: field.msg });
    }
  });

  const social = [
    { type: 'facebook', class: 'fa fa-facebook' },
    { type: 'google', class: 'fa fa-google' },
    { type: 'linkedin', class: 'fa fa-linkedin' },
    { type: 'github', class: 'fa fa-github' },
  ];

  const icons = social.map(icon => (
    <li key={icon.type}>
      <span
        role="button"
        tabIndex={0}
        className="social-icon"
        onClick={props.handleOAuth(icon.type)}
      >
        <i className={icon.class} />
      </span>
    </li>
  ));

  icons.push(
    <li key="42">
      <span
        role="button"
        tabIndex={0}
        className="social-icon"
        onClick={props.handleOAuth('42')}
      >
        <img className="logo-42" src={logo42} alt="42" />
      </span>
    </li>,
  );

  const welcome = props.intl.formatMessage({ id: 'homepage.welcomeTo' });
  const yourEmail = props.intl.formatMessage({ id: 'homepage.yourEmail' });
  const email = props.intl.formatMessage({ id: 'homepage.email' });
  const yourPassword = props.intl.formatMessage({ id: 'homepage.yourPassword' });
  const password = props.intl.formatMessage({ id: 'homepage.password' });
  const forgot = props.intl.formatMessage({ id: 'homepage.forgotPasswordLink' });
  const signUp = props.intl.formatMessage({ id: 'homepage.signUpLink' });
  const enter = props.intl.formatMessage({ id: 'general.enter' });

  return (
    <div>
      <div className="homepage-background" />
      <div className="homepage-container">
        <form
          onSubmit={props.handleSubmit}
          onChange={props.handleChange}
        >
          <h2 className="homepage-title">
            {welcome}
            <span className="homepage-hypertube-title"> Hypertube</span>
          </h2>
          <TextField
            hintText={yourEmail}
            name="email"
            errorText={error.email}
            floatingLabelText={email}
          />
          <br />
          <TextField
            hintText={yourPassword}
            type="password"
            name="password"
            errorText={error.password}
            floatingLabelText={password}
          />
          <br />
          <RaisedButton className="homepage-submit" type="submit" name="submit" label={enter} />
          <br />
          <ul className="social-icons">
            {icons}
          </ul>
          <Link to="/forgot" className="homepage-linkto">{forgot}</Link>
          <br />
          <Link to="/signup" className="homepage-linkto">{signUp}</Link>
        </form>
      </div>
    </div>
  );
};


SigninComponent.PropTypes = {
  error: PropTypes.array.required,
  handleSubmit: PropTypes.func.required,
  handleChange: PropTypes.func.required,
  handleOAuth: PropTypes.func.required,
};

export default injectIntl(SigninComponent);
