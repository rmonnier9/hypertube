import React, { Component } from 'react';
import '../css/CardOverlay.css';

class CardOverlay extends Component {

  render() {
    const { movie } = this.props;
    return (
      <div className="card-overlay">
        <i className="glyphicon glyphicon-star card-star-icon" />
        <h4>{movie.rating} / 10</h4>
        <br />
        <h4>{movie.genres[0]}</h4>
        <h4>{movie.genres[1]}</h4>
        <div className="card-button-container">
          <button className="card-button">View details</button>
        </div>
      </div>
    );
  }
}

export default CardOverlay;
