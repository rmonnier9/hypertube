import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

class SeasonsButtons extends Component {

  handleClick = (event) => {
    const season = event.target.id;
    this.props.onClick(season);
  }

  render() {
    const { movie } = this.props;
    let seasonsButtons = '';
    if (movie.torrents[0].season) {
      const seasons = [...new Set(movie.torrents.map(torrent => parseInt(torrent.season, 10)))];
      seasons.sort((a, b) => a - b);
      const text = this.props.intl.formatMessage({ id: 'movie.season' });
      seasonsButtons = seasons.map(season => (
        <button key={season} id={season} onClick={this.handleClick}>{text} {season}</button>
      ));
    }

    return (
      <div className="season-buttons">
        {seasonsButtons}
      </div>
    );
  }
}

export default injectIntl(SeasonsButtons);
