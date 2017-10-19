import React, { Component } from 'react';
import axios from 'axios';
import { injectIntl } from 'react-intl';
import Loading from '../../General/components/Loading';
import Card from '../../Gallery/components/Card';
import CommentProfile from '../../Comment/components/CommentProfile';
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
    .then(({ data: { error, user, movies, comments } }) => {
      if (error.length) {
        this.setState({ error });
      } else {
        this.user = user;
        this.movies = movies;
        this.comments = comments;
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

    const profile = this.props.intl.formatMessage({ id: 'profile.profile' });
    const movieSeen = this.props.intl.formatMessage({ id: 'profile.movieSeen' });
    const comments = this.props.intl.formatMessage({ id: 'comments.comments' });

    let Cards = '';
    if (this.movies.length !== 0) {
      Cards =
      (<div className="one-profile-movies">
        <div className="one-profile-seen">{movieSeen}<span className="glyphicon glyphicon-ok movie-seen" /></div>
        <div className="movie-list-container movie-list-container-profile">
          {this.movies
          .filter(movie => movie.idImdb)
          .map(movie => <Card key={movie.idImdb} movie={movie} user={this.user} />)}
        </div>
      </div>);
    }

    let Comments = '';
    if (this.comments.length !== 0) {
      Comments =
      (<div className="profile-container">
        <div className="one-profile-seen">
          <i className="glyphicon glyphicon-comment comment-icon" />
          {comments}
        </div>
        <CommentProfile comments={this.comments} user={this.user} />
      </div>);
    }

    return (
      <div className="one-profile-container">
        <div>
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
          {Comments}
        </div>
        {Cards}
      </div>
    );
  }

}

export default injectIntl(OneProfile);
