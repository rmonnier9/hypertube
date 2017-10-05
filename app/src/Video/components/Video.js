import React, { Component } from 'react'

export default class App extends Component {
  render() {
    const { id, hash } = this.props.match.params;
    const url = `http://localhost:3000/api/movie/stream/${id}/${hash}`;

    return (
      <video id="videoPlayer" controls>
        <source src={url} type="video/mp4" />
      </video>
    );
  }
}
