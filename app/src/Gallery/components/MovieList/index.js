import React from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import GalleryBackground from '../../images/Gallery_background.jpg';
import Card from '../Card.js';
import '../../css/CardOverlay.css';
import styles from './index.css'


const GalleryComponent = ({ movies }) => {
  const Cards = movies.map(movie => (
    (<Card key={movie.id} movie={movie} style={styles.card} />)
  ));
  // const Cardi = (<Card key={movies[0].id} movie={movies[0]} style={styles.card} />)
  return (
    <div style={styles.acontainer}>
      {Cards}
    </div>
  );
};

GalleryComponent.PropTypes = {
};

export default GalleryComponent;
