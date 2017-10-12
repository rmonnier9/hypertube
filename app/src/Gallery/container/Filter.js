import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import queryString from 'query-string';

import SubmitForm from '../../General/components/SubmitForm.js';
import Selectors from '../components/Selectors.js';

class Filter extends Component {

  state = {
    genre: 'all',
    rating: 0,
    sort: 'latest',
    genres: [],
  }

  componentDidMount() {
    const url = '/api/genres';
    axios({ url, method: 'GET' })
    .then(({ data: { genres } }) => {
      const parsed = queryString.parse(this.props.location.search);
      if (parsed.genre === undefined) {
        this.setState({ genre: 'all', rating: 0, sort: 'latest', genres });
      } else {
        this.setState({ ...parsed, genres });
      }
    });
  }

  componentWillReceiveProps = (nextProps) => {
    const parsed = queryString.parse(nextProps.location.search);
    if (parsed.genre === undefined) {
      this.setState({ genre: 'all', rating: 0, sort: 'latest' });
    } else {
      this.setState({ ...parsed });
    }
  }

  saveState = (name, value) => {
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { genre, rating, sort } = this.state;
    const search = Object.assign({ genre }, { rating }, { sort });
    this.props.onFilter(search);
  }

  render() {
    const filter = { ...this.state };

    return (
      <form className="selects-container" id="user-form" onSubmit={this.handleSubmit}>
        <Selectors
          locale={this.props.locale}
          filter={filter}
          onSelect={this.saveState}
        />
        <SubmitForm
          className="btn btn-default gallery-search-button"
          id="gallery.filter"
        />
      </form>
    );
  }
}

const mapStateToProps = ({ i18n: { locale } }) => ({
  locale,
});

export default connect(mapStateToProps)(Filter);
