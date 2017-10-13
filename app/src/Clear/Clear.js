import React, { Component } from 'react';
import axios from 'axios';

class Deleter extends Component {

  state = { load: false };

  callApiForReset = (e) => {
    e.preventDefault();
    const url = '/api/movie/clearAll';
    axios.get(url)
      .then(() => {
        this.setState({ load: 'complete' });
      });
  }

  askConfirm = (e) => {
    e.preventDefault();
    this.setState({ load: 'try' });
  }

  render() {
    if (!this.state.load) {
      return <a href="" onClick={this.askConfirm}>Click on this link will delete the folder torrent in the api and erase all data in downloaded torrents</a>;
    } else if (this.state.load === 'try') {
      return <a href="" onClick={this.callApiForReset}>Are you sure ?</a>;
    }
    return <div>Complete !</div>;
  }
}

export default Deleter;
