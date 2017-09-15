import React from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import GalleryBackground from '../Images/Gallery_background.jpg';

const styles = {
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

const GalleryComponent = () => (
  <div>
    <div style={styles.background} />
    <div style={styles.container}>
      <h2>GALLERY =&gt; UPCOMMING...</h2>
    </div>
  </div>
);

GalleryComponent.PropTypes = {
};

export default GalleryComponent;
