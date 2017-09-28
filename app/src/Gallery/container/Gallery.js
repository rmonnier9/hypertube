import React, { Component } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList.js';
import SearchBar from '../components/SearchBar.js';


class Gallery extends Component {

  state = {
    movies: null,
  }

  componentDidMount() {
    // this.initialQuery('/api/gallery/initial')
    axios.get('/api/gallery/suggestions')
    .then(({ data: { error, movies, message } }) => {
      if (error) {
        console.log('galery error:', message);
      } else {
        console.log('movies', movies);
        this.setState({ movies });
      }
    });
  }

  yifiQuery = (url) => {
    axios.get(url)
    .then(({ status, status_message, data }) => {
      if (status === 'error') {
        console.log('yifi error:', status_message);
      } else {
        console.log('yifi success', data);
        const { movies } = data.data;
        this.setState({ yifiMovies: movies });
      }
    });
  }

  eztvQuery = (url) => {
    axios.get(url)
    .then(({ status, status_message, data }) => {
      if (status !== 200) {
        console.log('eztv error': status_message);
      } else {
        console.log('eztv success', data);
        const { torrents } = data;
        this.setState({ eztvTorrents: torrents });
      }
    });
  }

  search = (params) => {
    console.log('params', params);
  }

  render() {
    const { yifiMovies, active } = this.state;
    if (!yifiMovies) return null;
    return (
      <div>
        <SearchBar onSearch={this.search} />
        <MovieList movies={yifiMovies} />
      </div>
    );
  }

}

export default Gallery;
