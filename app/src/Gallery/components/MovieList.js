import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Card from './Card.js';

class MovieList extends Component {

  render() {
    const { movies, hasMoreItems, user } = this.props;
    if (movies.length === 0 && hasMoreItems === false) {
      const noMovie = this.props.intl.formatMessage({ id: 'gallery.noMovie' });
      return (
        <div className="no-movie">{noMovie}</div>
      );
    }

    const Cards = movies
    .filter(movie => movie.idImdb)
    .map(movie => <Card key={movie.idImdb} movie={movie} user={user} />);

    return (
      <div className="movie-list-container">
        {Cards}
      </div>
    );
  }
}

MovieList.PropTypes = {
};

export default injectIntl(MovieList);
