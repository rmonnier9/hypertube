import React, { Component } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import Switcher from '../components/Switcher';


// import FilterBar from '../components/FilterBar.js';

const initialQueryYifi = 'https://yts.ag/api/v2/list_movies.json';
const initialQueryEztv = 'https://eztv.ag/api/get-torrents?limit=10&page=1';

class Gallery extends Component {

  state = {
    movies: null,
    active: 'yifi',
  }

  componentDidMount() {
    // this.eztvQuery(initialQueryEztv);
    this.yifiQuery(initialQueryYifi);
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
        this.setState({ yifiMovies: movies });
      }
    });
  }

  switcher = (source) => {

  }

  filterQuery = (params) => {

  }

  render() {
    const { yifiMovies, eztvMovies, active } = this.state;
    if (!yifiMovies) return null;
    return (
      <div>
        <Switcher switchTab={this.switcher} />
        { active === 'yifi' ? <MovieList movies={yifiMovies} /> : null }
        { active === 'eztv' ? <MovieList movies={eztvMovies} /> : null }
      </div>
    );
  }

}

export default Gallery;
