import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

class Selectors extends Component {

  handleSelect = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.props.onSelect(name, value);
  }

  render() {
    const lang = this.props.intl.locale.split('-')[0];
    const { filter } = this.props;
    const genreOptions = filter.genres
    .sort((a, b) => { if (a[lang] > b[lang]) return 1; return -1; })
    .map((movieGenre) => {
      const value = movieGenre.en;
      const { _id: id } = movieGenre;
      return <option key={id} value={value}>{movieGenre[lang]}</option>;
    });

    const oldest = this.props.intl.formatMessage({ id: 'gallery.oldest' });
    const latest = this.props.intl.formatMessage({ id: 'gallery.latest' });
    const seeds = this.props.intl.formatMessage({ id: 'gallery.seeds' });
    const rating = this.props.intl.formatMessage({ id: 'gallery.rating' });
    const name = this.props.intl.formatMessage({ id: 'profile.name' });
    const all = this.props.intl.formatMessage({ id: 'gallery.all' });
    const genres = this.props.intl.formatMessage({ id: 'gallery.genres' });
    const orderBy = this.props.intl.formatMessage({ id: 'gallery.orderBy' });

    return (
      <div className="all-selectors">
        <div className="one-selector">
          <div>{genres}:</div>
          <select
            name="genre"
            className="selector-box"
            onChange={this.handleSelect}
            value={filter.genre}
          >
            <option value="">{all}</option>
            {genreOptions}
          </select>
        </div>
        <div className="one-selector">
          <div>{rating}:</div>
          <select
            name="rating"
            className="selector-box"
            onChange={this.handleSelect}
            value={filter.rating}
          >
            <option value="0">{all}</option>
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
          <div>{orderBy}:</div>
          <select
            name="sort"
            className="selector-box"
            onChange={this.handleSelect}
            value={filter.sort}
          >
            <option value="" />
            <option value="latest">{latest}</option>
            <option value="oldest">{oldest}</option>
            <option value="seeds">{seeds}</option>
            <option value="rating">{rating}</option>
            <option value="name">{name}</option>
          </select>
        </div>
      </div>
    );
  }
}

export default injectIntl(Selectors);
