import React from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Card from '../Card';
import './index.css';


const MovieList = ({ movies }) => {
  const Cards = movies.map(movie => (
    (<Card key={movie.id} movie={movie} />)
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
