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
    this.props.onSearch(this.state.search);
  }

  render() {
    const search = this.state.search || this.props.location.search.split('=').pop();

    return (
      <form className="" onSubmit={this.handleSubmit}>
        <TextInput
          currentValue={search}
          name="search"
          type="text"
          text=""
          className="searchBar-container"
          onChange={this.handleChange}
          autocomplete="off"
          placeholder="Search title, actor, director..."
        />
      </form>
    );
  }
}

export default SearchBar;
