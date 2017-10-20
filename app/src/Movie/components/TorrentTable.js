import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import SeasonsButtons from './SeasonsButtons';

class TorrentTable extends Component {

  constructor(props) {
    super(props);
    const { movie } = this.props;
    let seasons = [];
    if (movie.torrents[0].season) {
      seasons = [...new Set(movie.torrents.map(torrent => parseInt(torrent.season, 10)))];
      seasons.sort((a, b) => a - b);
    }
    this.state = {
      season: seasons[0] || 0,
      seasons,
    };
  }

  showSeason = (season) => {
    this.setState({ season });
  }

  beautyTorrent = (torrent, movie, lang) => (
    <tr key={torrent.hash}>
      <td>{torrent.title[lang]}</td>
      <td style={{ width: '70px' }}>{torrent.size}</td>
      <td style={{ color: 'green' }}>{torrent.seeds}</td>
      <td style={{ color: 'red' }}>{torrent.peers}</td>
      <td>
        <Link to={`/video/${movie.idImdb}/${torrent.hash}`} className="play">
          <span className="glyphicon glyphicon-play-circle" /> {/* download video or play video on click */}
        </Link>
      </td>
    </tr>
  )

  render() {
    const { movie, lang } = this.props;
    const { seasons, season } = this.state;

    let torrents;
    if (!seasons.length) {
      torrents = movie.torrents.map(torrent => this.beautyTorrent(torrent, movie, lang));
    } else {
      movie.torrents.sort((a, b) => parseInt(a.episode, 10) - parseInt(b.episode, 10));
      torrents = movie.torrents.map((torrent) => {
        if (torrent.season === String(season)) {
          return this.beautyTorrent(torrent, movie, lang);
        }
        return null;
      });
    }

    const video = this.props.intl.formatMessage({ id: 'movie.video' });
    const size = this.props.intl.formatMessage({ id: 'movie.size' });
    const play = this.props.intl.formatMessage({ id: 'movie.play' });

    return (
      <div className="movie-torrents">
        <SeasonsButtons movie={movie} onClick={this.showSeason} />
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
