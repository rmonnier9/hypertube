import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/CardOverlay.css';

class CardOverlay extends Component {

  render() {
    const { rating, year, idImdb } = this.props.movie;
    const link = `/movie/${idImdb}`;
    return (
      <div className="card-overlay">
        <i className="glyphicon glyphicon-star card-star-icon" />
        <div className="card-overlay-infos">{`${rating} / 10`} </div>
        <br />
        <div className="card-button-container">
          <Link className="card-button"to={link}>View details</Link>
        </div>
        <div className="card-overlay-infos">{year}</div>
      </div>
    );
  }
}

export default CardOverlay;

// <button className="card-button">View details</button>
// <h4>{movie.genres[0] || null}</h4>
// <h4>{movie.genres[1] || null}</h4>
