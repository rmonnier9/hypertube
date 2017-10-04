import React, { Component } from 'react';

class Selectors extends Component {

  handleSelect = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.props.onSelect(name, value);
  }

  render() {
    const { genres, genre, rating, orderBy } = this.props;

    return (
      <div className="all-selectors">
        <div className="one-selector">
          <div>Genres:</div>
          <select
            name="genre"
            className="selector-box"
            onChange={this.handleSelect}
            value={genre}
          >
            <option value="all">All</option>
            <option value="action">Action</option>
          </select>
        </div>
        <div className="one-selector">
          <div>Rating:</div>
          <select
            name="rating"
            className="selector-box"
            onChange={this.handleSelect}
            value={rating}
          >
            <option value="0">All</option>
            <option value="9">9+</option>
            <option value="8">8+</option>
            <option value="7">7+</option>
            <option value="6">6+</option>
            <option value="5">5+</option>
            <option value="4">4+</option>
            <option value="3">3+</option>
            <option value="2">2+</option>
            <option value="1">1+</option>
          </select>
        </div>
        <div className="one-selector">
          <div>Order By:</div>
          <select
            name="orderBy"
            className="selector-box"
            onChange={this.handleSelect}
            value={orderBy}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="seeds">Seeds</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
    );
  }
}

export default Selectors;
