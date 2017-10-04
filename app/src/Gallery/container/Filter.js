import React, { Component } from 'react';
import axios from 'axios';
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
      this.setState({ genres });
    });
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
    const { genres } = this.state;
    const filter = { ...this.state };

    return (
      <form className="selects-container" id="user-form" onSubmit={this.handleSubmit}>
        <Selectors
          genres={genres}
          filter={filter}
          onSelect={this.saveState}
        />
        <SubmitForm
          className="btn btn-default gallery-search-button"
          value="Search"
        />
      </form>
    );
  }
}

export default Filter;
