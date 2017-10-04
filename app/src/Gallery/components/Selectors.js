import React, { Component } from 'react';

const lang = 'en';

class Selectors extends Component {

  handleSelect = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.props.onSelect(name, value);
  }

  render() {
    const { genres, filter } = this.props;
    const genreOptions = genres
    .sort((a, b) => { if (a[lang] > b[lang]) return 1; return -1; })
    .map((movieGenre) => {
      const value = movieGenre.en;
      const { _id: id } = movieGenre;
      return <option key={id} value={value}>{movieGenre[lang]}</option>;
    });

    return (
      <div className="all-selectors">
        <div className="one-selector">
          <div>Genres:</div>
          <select
            name="genre"
            className="selector-box"
            onChange={this.handleSelect}
            value={filter.genre}
          >
            <option value="all">All</option>
            {genreOptions}
          </select>
        </div>
        <div className="one-selector">
          <div>Rating:</div>
          <select
            name="rating"
            className="selector-box"
            onChange={this.handleSelect}
            value={filter.rating}
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
            name="sort"
            className="selector-box"
            onChange={this.handleSelect}
            value={filter.sort}
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
