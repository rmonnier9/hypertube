import React, { Component } from 'react';
import axios from 'axios';
import GalleryComponent from '../components/GalleryComponent.js';

class Gallery extends Component {

  state = {
    movies: null,
  }

  componentDidMount() {
    const url = 'https://yts.ag/api/v2/list_movies.json';
    axios({ url, method: 'GET' })
    .then(({ status, status_message, data }) => {
      if (status === 'error') {
        console.log('yifi error:', status_message);
      } else {
        console.log('yifi success', data);
        const { movies } = data.data;
        this.setState({ movies });
      }
    });
  }

  render() {
    const { movies } = this.state;
    if (!movies) return null;
    return (
      <GalleryComponent movies={movies} />
    );
  }

}

export default Gallery;
