import React, { Component } from 'react';
import axios from 'axios';
import { injectIntl } from 'react-intl';
import Loading from '../../General/components/Loading';
import Card from '../../Gallery/components/Card.js';
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
    .then(({ data: { error, user, movies } }) => {
      if (error.length) {
        this.setState({ error });
      } else {
        this.user = user;
        this.movies = movies;
        this.setState({ profileLoaded: true });
      }
    });
  }

  render() {
    const {
      profileLoaded,
      error,
    } = this.state;

    const errorMessage = error[0].msg
      ? this.props.intl.formatMessage({ id: error[0].msg })
      : '';
    if (error[0].msg) {
      return <div className="one-user-profile-error">{errorMessage}</div>;
    }

    if (!profileLoaded) { return <Loading />; }

    const { firstName, lastName, picture } = this.user.profile;

    let Cards = '';
    if (this.movies.length !== 0) {
      Cards =
      (<div className="movie-list-container one-profile-movies">
        {this.movies
        .filter(movie => movie.idImdb)
        .map(movie => <Card key={movie.idImdb} movie={movie} user={this.user} />)}
      </div>);
    }

    const profile = this.props.intl.formatMessage({ id: 'profile.profile' });

    return (
      <div className="one-profile-container">
        <div className="profile-container">
          <h1 className="profile-title">{profile}</h1>
          <div>
            <img className="profile-pic" src={`/static/uploads/${picture}`} alt="profile-pic" />
          </div>
          <div className="infos-container one-user-profile">
            <span className="infos-title"><b>Name</b></span>
            <span>{firstName} {lastName}</span>
          </div>
        </div>
        {Cards}
      </div>
    );
  }

}

export default injectIntl(OneProfile);
