import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const InputReset = (props) => {
  const error = {};
  props.error.forEach((field) => {
    if (field.msg) {
      error[field.param] = props.intl.formatMessage({ id: field.msg });
    }
  });

  const { success } = props;
  const confirmResetPassword = success ? props.intl.formatMessage({ id: 'homepage.confirmResetPassword' }) : '';

  const changePassword = props.intl.formatMessage({ id: 'homepage.changePassword' });
  const confirmPassword = props.intl.formatMessage({ id: 'homepage.confirmPassword' });
  const password = props.intl.formatMessage({ id: 'homepage.password' });
  const yourPassword = props.intl.formatMessage({ id: 'homepage.yourPassword' });
  const logIn = props.intl.formatMessage({ id: 'homepage.logIn' });
  const send = props.intl.formatMessage({ id: 'general.send' });

  return (
    <div>
      <div className="homepage-background" />
      <div className="homepage-container">
        <form
          onSubmit={props.handleSubmit}
          onChange={props.handleChange}
        >
          <h2 className="homepage-title">{changePassword}</h2>
          <TextField
            hintText={yourPassword}
            type="password"
            name="password"
            errorText={error.newPassword}
            floatingLabelText={password}
          />
          <br />
          <TextField
            hintText={yourPassword}
            type="password"
            name="confirmPassword"
            errorText={error.confirmPassword}
            floatingLabelText={confirmPassword}
          />
          <br />
          <RaisedButton className="homepage-submit" type="submit" name="submit" label={send} />
        </form>
        <br />
        <div style={{ color: 'green' }}>{confirmResetPassword}</div>
        <div style={{ color: 'red' }}>{error.token}</div>
        <br />
        <Link to="/signin" className="homepage-linkto">{logIn}</Link>
      </div>
    </div>
  );
};

export default injectIntl(InputReset);
