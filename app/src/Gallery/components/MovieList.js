import React from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Card from './Card.js';
import '../css/MovieList.css';


const MovieList = ({ movies }) => {
  if (!movies) return null;
  const Cards = movies.map(movie => (
    (<Card key={movie.imdb_code} movie={movie} />)
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
