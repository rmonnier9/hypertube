import React, { Component } from 'react';
import queryString from 'query-string';
import TextInput from '../../General/components/TextInput';

class SearchBar extends Component {

  state = {
    search: '',
  }

  componentDidMount = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.name) {
      this.setState({ search: parsed.name });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const parsed = queryString.parse(nextProps.location.search);
    if (parsed.name) {
      this.setState({ search: parsed.name });
    } else {
      this.setState({ search: '' });
    }
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSearch(this.state.search);
  }

  render() {
    const search = this.state.search;

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
