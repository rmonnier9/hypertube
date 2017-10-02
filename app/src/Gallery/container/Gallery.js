import React, { Component } from 'react';
import axios from 'axios';
import Loading from '../../General/components/Loading';
import MovieList from '../components/MovieList.js';
import SearchBar from '../components/SearchBar.js';


class Gallery extends Component {

  state = {
    movies: [],
  }

  componentDidMount() {
    // this.initialQuery('/api/gallery/initial')
    axios.get('/api/gallery/suggestion')
    .then(({ data: { error, movies } }) => {
      if (error) {
        console.log(error);
      } else {
        this.setState({ movies });
      }
    });
  }

  search = (params) => {
    console.log('params', params);
  }

  render() {
    const { movies } = this.state;
    if (movies.length === 0) { return <Loading />; }
    return (
      <div>
        <SearchBar onSearch={this.search} />
        <MovieList movies={movies} />
      </div>
    );
  }

}

export default Gallery;
