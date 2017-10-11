import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const InputForgot = (props) => {
  const error = {};
  props.error.forEach((field) => {
    if (field.msg) {
      error[field.param] = props.intl.formatMessage({ id: field.msg });
    }
  });

  const { success } = props;
  const confirmForgotPassword = success ? props.intl.formatMessage({ id: 'homepage.confirmForgotPassword' }) : '';

  const forgotPassword = props.intl.formatMessage({ id: 'homepage.forgotPassword' });
  const yourEmail = props.intl.formatMessage({ id: 'homepage.yourEmail' });
  const email = props.intl.formatMessage({ id: 'homepage.email' });
  const nevermind = props.intl.formatMessage({ id: 'homepage.nevermind' });
  const send = props.intl.formatMessage({ id: 'general.send' });

  return (
    <div>
      <div className="homepage-background" />
      <div className="homepage-container">
        <form
          onSubmit={props.handleSubmit}
          onChange={props.handleChange}
        >
          <h2 className="homepage-title">{forgotPassword}</h2>
          <TextField
            hintText={yourEmail}
            name="email"
            errorText={error.email}
            floatingLabelText={email}
          />
          <br />
          <RaisedButton className="homepage-submit" type="submit" name="submit" label={send} />
        </form>
        <br />
        <div style={{ color: 'green' }}>{confirmForgotPassword}</div>
        <br />
        <Link to="/signin" className="homepage-linkto">{nevermind}</Link>
      </div>
    </div>
  );
};

export default injectIntl(InputForgot);
