import React, { Component } from 'react';
import axios from 'axios';
import GalleryComponent from '../components/GalleryComponent.js';
import Switcher from '../components/Switcher.js'
// import FilterBar from '../components/FilterBar.js';

const initialQueryYifi = 'https://yts.ag/api/v2/list_movies.json';
const initialQueryEztv = 'https://eztv.ag/api/get-torrents?limit=10&page=1';

class Gallery extends Component {

  state = {
    movies: null,
  }

  componentDidMount() {
    this.eztvQuery(initialQueryEztv);
    // this.yifiQuery(initialQueryYifi);
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
      <div>
        <Switcher switch={this.switcher} />
      </div>
    );
  }

}

export default Gallery;
