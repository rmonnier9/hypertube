import React, { Component } from 'react';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
// import ProfilePic from '../components/ProfilePic.js';
import '../css/profile.css';

class OneProfile extends Component {

  state = {
    profileLoaded: false,
    error: '',
  }

  componentDidMount() {
    const { pathname } = this.props.location;
    const id = pathname.split('/').pop();
    const url = `/api/profile/id/${id}`;
    axios({ url, method: 'GET' })
    .then(({ data: { error, user } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.user = user;
        this.setState({
          profileLoaded: true,
        });
      }
    });
  }

  render() {
    const {
      profileLoaded,
      error,
    } = this.state;
    if (error || !profileLoaded) {
      return (<div><h1>{error || 'Loading...'}</h1></div>);
    }

    const {
      firstName,
      lastName,
      picture,
    } = this.user.profile;

    return (
      <div className="profile-container">
        <h1 className="profile-title">
          <FormattedMessage
            id="Profil"
            defaultMessage="Profil"
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

export default OneProfile;
