import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import Selectors from '../components/Selectors.js';

class Filter extends Component {

  state = {
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
    this.props.onFilter(name, value);
  }

  render() {
    const { genres } = this.state;
    const { genre, rating, sort } = this.props;
    const filter = Object.assign({ genre }, { rating }, { sort }, { genres });

    return (
      <form className="selects-container" id="user-form">
        <Selectors
          locale={this.props.locale}
          filter={filter}
          onSelect={this.saveState}
        />
      </form>
    );
  }
}

const mapStateToProps = ({ i18n: { locale } }) => ({
  locale,
});

export default connect(mapStateToProps)(Filter);
