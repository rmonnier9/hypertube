import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

class TorrentTable extends Component {

  render() {
    const { movie, lang } = this.props;
    const torrents = movie.torrents.map(torrent => (
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
    ));

    const video = this.props.intl.formatMessage({ id: 'movie.video' });
    const size = this.props.intl.formatMessage({ id: 'movie.size' });
    const play = this.props.intl.formatMessage({ id: 'movie.play' });

    return (
      <div className="movie-torrents">
        <table className="table torrents-table">
          <thead>
            <tr>
              <th>{video}</th>
              <th>{size}</th>
              <th style={{ color: 'green' }}>Seeds</th>
              <th style={{ color: 'red' }}>Peers</th>
              <th>{play}</th>
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

export default injectIntl(TorrentTable);
