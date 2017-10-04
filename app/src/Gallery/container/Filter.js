import React, { Component } from 'react';
// import axios from 'axios';
import SubmitForm from '../../General/components/SubmitForm.js';
import Selectors from '../components/Selectors.js';

class Filter extends Component {

  state = {
    genre: 'all',
    rating: 0,
    orderBy: 'latest',
    genres: [],
  }

  componentDidMount() {
    // const url = '/api/getGenres';
    // axios({ url, method: 'GET' })
    // .then(({ data: { genres } }) => {
    //   this.setState({ genres });
    // });
  }

  saveState = (name, value) => {
    this.setState({ [name]: value });
  }


  handleSubmit = (event) => {
    event.preventDefault();
    const { genre, rating, orderBy } = this.state;
    const search = Object.assign({ genre }, { rating }, { orderBy });
    this.props.onFilter(search);
  }

  render() {
    const { genres } = this.state;

    return (
      <form className="selects-container" id="user-form" onSubmit={this.handleSubmit}>
        <Selectors
          genres={genres}
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
