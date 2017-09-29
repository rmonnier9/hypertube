import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

// <FormattedMessage
//   id="Profil"
//   defaultMessage="Profil"
// />

class TorrentTable extends Component {

  render() {
    const { movie, lang } = this.props;
    const torrents = movie.torrents.map((torrent) => {
      const title = (movie.source === 'yifi' ? `${movie.title[lang]} - ${torrent.quality}` : movie.title);
      return (
        <tr key={torrent.hash}>
          <td>{title}</td>
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
              <th>
                <FormattedMessage
                  id="Movie"
                  defaultMessage="Movie"
                />
              </th>
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
