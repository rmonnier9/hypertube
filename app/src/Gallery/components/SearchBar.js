import React, { Component } from 'react';
import queryString from 'query-string';
import TextInput from '../../General/components/TextInput';

class SearchBar extends Component {

  state = {
    name: '',
  }

  componentDidMount = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.name) {
      this.setState({ name: parsed.name });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const parsed = queryString.parse(nextProps.location.search);
    if (parsed.name) {
      this.setState({ name: parsed.name });
    } else {
      this.setState({ name: '' });
    }
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSearch(this.state.name);
  }

  render() {
    const { name } = this.state;

    return (
      <form className="" onSubmit={this.handleSubmit}>
        <TextInput
          currentValue={name}
          name="name"
          type="text"
          id=""
          className="searchBar-container"
          onChange={this.handleChange}
          autocomplete="off"
          placeholder="gallery.searchPlaceholder"
        />
      </form>
    );
  }
}

export default SearchBar;
