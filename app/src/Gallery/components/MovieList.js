import React from 'react';
// import PropTypes from 'prop-types';
import Card from './Card.js';

const MovieList = ({ movies }) => {

  if (!movies) { return null; }
  const Cards = movies.map(movie => (
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
