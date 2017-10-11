import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class SigninComponent extends Component {

  render() {
  	const oauth = (url) => window.location.replace(`${url}?next=http://localhost:3000`);

    const error = {};
    this.props.error.forEach((field) => {
      if (field.msg) {
        error[field.param] = this.props.intl.formatMessage({ id: field.msg });
      }
    });

    const welcome = this.props.intl.formatMessage({ id: 'homepage.welcomeTo' });
    const yourEmail = this.props.intl.formatMessage({ id: 'homepage.yourEmail' });
    const email = this.props.intl.formatMessage({ id: 'homepage.email' });
    const yourPassword = this.props.intl.formatMessage({ id: 'homepage.yourPassword' });
    const password = this.props.intl.formatMessage({ id: 'homepage.password' });
    const forgot = this.props.intl.formatMessage({ id: 'homepage.forgotPasswordLink' });
    const signUp = this.props.intl.formatMessage({ id: 'homepage.signUpLink' });
    const enter = this.props.intl.formatMessage({ id: 'general.enter' });

    return (
      <div>
        <div className="homepage-background" />
        <div className="homepage-container">
          <form
            onSubmit={this.props.handleSubmit}
            onChange={this.props.handleChange}
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
            <span
              onClick={() => oauth('/api/auth/google')}
            >
              Google Auth
            </span>
            <br />
            <span
              onClick={() => oauth('/api/auth/42')}
            >
              42 Auth
            </span>
            <br />
            <Link to="/forgot" className="homepage-linkto">{forgot}</Link>
            <br />
            <Link to="/signup" className="homepage-linkto">{signUp}</Link>
          </form>
        </div>
      </div>
    );
  }
}

SigninComponent.PropTypes = {
  error: PropTypes.array.required,
  handleSubmit: PropTypes.func.required,
  handleChange: PropTypes.func.required,
};

export default injectIntl(SigninComponent);
