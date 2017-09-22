import React, { Component } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
// import FilterBar from '../components/FilterBar.js';

const initialQuery = 'https://yts.ag/api/v2/list_movies.json';
const inti = 'https://eztv.ag/api/get-torrents?limit=10&page=1';

class Gallery extends Component {

  state = {
    movies: null,
  }

  componentDidMount() {
    this.eztvQuery(inti);
    // this.yifiQuery(initialQuery);
  }

  eztvQuery = (url) => {
    axios({ url, method: 'GET' })
    .then((data) => {
      console.log('data', data);
      // if (status === 'error') {
      //   console.log('eztv error:', status_message);
      // } else {
      //   console.log('eztv success', data);
      //   const { movies } = data.data;
        // this.setState({ movies });
    });
  }

  yifiQuery = (url) => {
    axios({ url, method: 'GET' })
    .then(({ status, status_message, data }) => {
      if (status === 'error') {
        console.log('yifi error:', status_message);
      } else {
        console.log('yifi success', data);
        const { movies } = data.data;
        // this.setState({ movies });
      }
    });
  }

  filterQuery = (params) => {

  }

  render() {
    const { movies } = this.state;
    if (!movies) return null;
    return (
      <MovieList movies={movies} />
      <div>


      </div>
    );
  }

}

export default Gallery;
