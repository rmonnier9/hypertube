import React from 'react';
// import PropTypes from 'prop-types';
import Card from './Card.js';

const MovieList = ({ movies }) => {
  if (movies.length === 0) {
    return (
      <div className="no-movie">
        No movies here for that search.
      </div>
    );
  }

  const Cards = movies
  .filter(movie => movie.idImdb)
  .map(movie => (
    <Card key={movie.idImdb} movie={movie} />
  ));

  return (
    <div className="movie-list-container">
      {Cards}
    </div>
  );
};

MovieList.PropTypes = {
};

export default MovieList;
