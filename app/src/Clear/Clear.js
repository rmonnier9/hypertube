import React, { Component } from 'react';
import axios from 'axios';

class Deleter extends Component {

  state = { load: false, id: '' };


  changeId = (e) => {
    e.preventDefault();
    const id = e.target.value;
    this.setState({ id });
  }
  callApiForReset = (e) => {
    e.preventDefault();
    const url = `/api/movie/clear/${this.state.id}`;
    axios.get(url)
      .then(() => {
        this.setState({ load: 'complete' });
      });
  }

  askConfirm = (e) => {
    e.preventDefault();
    const { id } = this.state;
    if (!id || id.lengt < 5) return;
    this.setState({ load: 'try' });
  }

  render() {
    if (!this.state.load) {
      return (
        <div>
          <a href="" onClick={this.askConfirm}>Click on this link will delete your torrent and sub folder and reset the data field in the following idImdb</a><br />
          Type an id here: <input style={{ color: 'black' }} onChange={this.changeId} value={this.state.id} type="text" name="idfordelete" />
        </div>
      );
    } else if (this.state.load === 'try') {
      return <a href="" onClick={this.callApiForReset}>Are you sure ?</a>;
    }
    return <div>Complete !</div>;
  }
}

export default Deleter;
