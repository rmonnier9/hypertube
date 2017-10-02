import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';

// <FormattedMessage
//   id="Profil"
//   defaultMessage="Profil"
// />

class TorrentTable extends Component {

  render() {
    const { movie, lang } = this.props;
    const torrents = movie.torrents.map((torrent) => {
      // const title = `${movie.title[lang]} - ${torrent.quality}`;
      return (
        <tr key={torrent.hash}>
          <td>{torrent.title[lang]}</td>
          <td>{torrent.size}</td>
          <td style={{ color: 'green' }}>{torrent.seeds}</td>
          <td style={{ color: 'red' }}>{torrent.peers}</td>
          <td>
            <button type="button" className="play">
              <span className="glyphicon glyphicon-play-circle" /> {/* download video or play video on click */}
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div className="movie-torrents">
        <table className="table torrents-table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Size</th>
              <th style={{ color: 'green' }}>Seeds</th>
              <th style={{ color: 'red' }}>Peers</th>
              <th>Play</th>
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
