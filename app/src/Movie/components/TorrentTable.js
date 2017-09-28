import React, { Component } from 'react';

class TorrentTable extends Component {

  render() {
    const { movie } = this.props;
    const torrents = movie.torrents.map(torrent => (
      <tr>
        <td>{torrent.url}</td>
        <td>{torrent.size}</td>
        <td>{torrent.quality}</td>
        <td>{torrent.seeds}</td>
        <td>{torrent.peers}</td>
      </tr>
    ));

    return (
      <div className="movie-torrents">
        <span>Torrents</span>
        <table className="torrents-table">
          <thead>
            <tr>
              <th>Url</th>
              <th>Size</th>
              <th>Quality</th>
              <th>Seeds</th>
              <th>Peers</th>
            </tr>
          </thead>
          <tbody>
            {torrents}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TorrentTable;
