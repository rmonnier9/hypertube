import React, { Component } from 'react';
import queryString from 'query-string';
import TextInput from '../../General/components/TextInput';

class SearchBar extends Component {

  state = {
    text: '',
  }

  componentDidMount = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.name) {
      this.setState({ text: parsed.name });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const parsed = queryString.parse(nextProps.location.search);
    if (parsed.name) {
      this.setState({ text: parsed.name });
    } else {
      this.setState({ text: '' });
    }
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSearch(this.state.text);
  }

  render() {
    const { text } = this.state;

    return (
      <form className="" onSubmit={this.handleSubmit}>
        <TextInput
          currentValue={text}
          name="text"
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
