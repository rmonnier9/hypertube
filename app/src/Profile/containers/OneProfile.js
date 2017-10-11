import React, { Component } from 'react';
import axios from 'axios';
import { FormattedMessage, injectIntl } from 'react-intl';
import Loading from '../../General/components/Loading';
import '../css/profile.css';

class OneProfile extends Component {

  state = {
    profileLoaded: false,
    error: [{ param: '', msg: '' }],
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const url = `/api/profile/id/${id}`;
    axios({ url, method: 'GET' })
    .then(({ data: { error, user } }) => {
      if (error.length) {
        this.setState({ error });
      } else {
        this.user = user;
        this.setState({
          profileLoaded: true
        });
      }
    });
  }

  render() {
    const {
      profileLoaded,
      error,
    } = this.state;
    const errorMessage = error[0].msg ? this.props.intl.formatMessage({ id: error[0].msg }) : '';

    if (error[0].msg) { return <div className="one-user-profile-error">{errorMessage}</div>; }

    if (!profileLoaded) { return <Loading />; }

    const {
      firstName,
      lastName,
      picture,
    } = this.user.profile;

    return (
      <div className="profile-container">
        <h1 className="profile-title">
          <FormattedMessage
            id="profil.profil"
            defaultMessage="Profile"
          />
        </h1>
        <div>
          <img className="profile-pic" src={`/static/uploads/${picture}`} alt="profile-pic" />
        </div>
        <div className="infos-container one-user-profile">
          <span className="infos-title"><b>Name</b></span>
          <span>{firstName} {lastName}</span>
        </div>
      </div>
    );
  }

}

export default injectIntl(OneProfile);
