import React, { Component } from 'react'

export default class App extends Component {
  render() {
    return (
      <video width="320" height="240" id="videoPlayer" controls>
        <source src="/api/movie/stream/12" type="video/mp4" />
      </video>
    );
  }
}
