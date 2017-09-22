import React from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import GalleryBackground from '../images/Gallery_background.jpg';
import Card from './Card.js';
import '../css/CardOverlay.css';

const styles = {
  acontainer: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'black',
  },
  container: {
    margin: 'auto',
    marginTop: '25vh',
    width: '360px',
    padding: '10px 25px 25px 25px',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: '10px',
    backgroundColor: 'white',
    borderColor: '#5f8191',
    position: 'relative',
    zIndex: 1,
    fontFamily: 'Impact, Charcoal, sans-serif',
  },
  background: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: `url(${GalleryBackground}) center center`,
    backgroundSize: 'repeat',
    opacity: 1,
    width: '100%',
    height: '100%',
  },
  button: {
    margin: '10px 0px',
    borderRadius: '10px',
  },
  centered: {
    textAlign: 'center',
  },
};


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
