import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import '../css/CardOverlay.css';

class CardOverlay extends Component {

  render() {
    const { rating, year, idImdb } = this.props.movie;
    const buttonValue = this.props.intl.formatMessage({ id: 'gallery.viewDetail' });
    const link = `/movie/${idImdb}`;
    return (
      <div className="card-overlay">
        <i className="glyphicon glyphicon-star card-star-icon" />
        <div className="card-overlay-infos">{`${rating} / 10`}</div>
        <br />
        <div className="card-button-container">
          <Link className="card-button" to={link}>{buttonValue}</Link>
        </div>
        <div className="card-overlay-infos">{year}</div>
      </div>
    );
  }
}

export default injectIntl(CardOverlay);
