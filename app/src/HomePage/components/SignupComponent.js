import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from './Dialog.js';

const SignupComponent = (props) => {
  const error = {};
  props.error.forEach((field) => {
    if (field.msg) {
      error[field.param] = props.intl.formatMessage({ id: field.msg });
    }
  });

  const signUp = props.intl.formatMessage({ id: 'homepage.signUp' });
  const yourEmail = props.intl.formatMessage({ id: 'homepage.yourEmail' });
  const email = props.intl.formatMessage({ id: 'homepage.email' });
  const yourLogin = props.intl.formatMessage({ id: 'homepage.yourLogin' });
  const login = props.intl.formatMessage({ id: 'homepage.login' });
  const yourPassword = props.intl.formatMessage({ id: 'homepage.yourPassword' });
  const password = props.intl.formatMessage({ id: 'homepage.password' });
  const confirmPassword = props.intl.formatMessage({ id: 'homepage.confirmPassword' });
  const yourFirstName = props.intl.formatMessage({ id: 'homepage.yourFirstName' });
  const firstName = props.intl.formatMessage({ id: 'profile.firstName' });
  const lastName = props.intl.formatMessage({ id: 'profile.lastName' });
  const yourLastName = props.intl.formatMessage({ id: 'homepage.yourLastName' });
  const alreadyMember = props.intl.formatMessage({ id: 'homepage.alreadyMember' });
  const next = props.intl.formatMessage({ id: 'general.next' });

  return (
    <div>
      <div className="homepage-background" />
      <div className="homepage-container">
        <form
          onSubmit={props.handleNextStep}
          onChange={props.handleChange}
        >
          <h2 className="homepage-title">{signUp}</h2>
          <TextField
            hintText={yourEmail}
            name="email"
            errorText={error.email}
            floatingLabelText={email}
            required
          />
          <br />
          <TextField
            hintText={yourLogin}
            name="login"
            errorText={error.login}
            floatingLabelText={login}
            required
          />
          <br />
          <TextField
            hintText={yourPassword}
            type="password"
            name="password"
            errorText={error.newPassword}
            floatingLabelText={password}
            required
          />
          <br />
          <TextField
            hintText={yourPassword}
            type="password"
            name="confirmPassword"
            errorText={error.confirmPassword}
            floatingLabelText={confirmPassword}
            required
          />
          <br />
          <TextField
            hintText={yourFirstName}
            name="firstName"
            errorText={error.firstName}
            floatingLabelText={firstName}
            required
          />
          <br />
          <TextField
            hintText={yourLastName}
            name="lastName"
            errorText={error.lastName}
            floatingLabelText={lastName}
            required
          />
          <br />
          <RaisedButton className="homepage-submit" type="submit" name="submit" label={next} />
          <br /><br />
          <Link to="/signin" className="homepage-linkto">{alreadyMember}</Link>
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
}


SignupComponent.PropTypes = {
  handleSubmit: PropTypes.func.required,
  handleChange: PropTypes.func.required,
  error: PropTypes.array.required,
};

export default injectIntl(SignupComponent);
