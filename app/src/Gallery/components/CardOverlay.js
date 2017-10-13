import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import '../css/CardOverlay.css';

class CardOverlay extends Component {

  render() {
    const { rating, year, idImdb } = this.props.movie;
    const { movies } = this.props.user.profile;
    const link = `/movie/${idImdb}`;

    const movieSeen = (movies.includes(idImdb)
      ? <div className="glyphicon glyphicon-ok card-overlay-seen" />
      : '');

    const buttonValue = this.props.intl.formatMessage({ id: 'gallery.viewDetail' });

    return (
      <div className="card-overlay">
        <i className="glyphicon glyphicon-star card-star-icon" />
        <span className="card-overlay-infos">{rating}</span>
        <span> {'/'}10</span>
        <div className="card-button-container">
          <Link className="card-button" to={link}>{buttonValue}</Link>
        </div>
        <div className="card-overlay-infos">{year}</div>
        {movieSeen}
      </div>
    );
  }
}

export default injectIntl(CardOverlay);
