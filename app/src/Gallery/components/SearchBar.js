import React, { Component } from 'react';
import TextInput from '../../General/components/TextInput';

class SearchBar extends Component {

  state = {
    search: '',
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.search);
    this.props.onSearch(this.state.search);
  }

  render() {
    const { search } = this.state;

    return (
      <form className="" onSubmit={this.handleSubmit}>
        <TextInput
          currentValue={search}
          name="search"
          type="text"
          text=""
          className="searchBar-container"
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default SearchBar;
