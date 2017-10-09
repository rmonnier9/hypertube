import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import TextInput from '../../General/components/TextInput.js';
import SubmitForm from '../../General/components/SubmitForm.js';

class FindUser extends Component {

  state = {
    userName: '',
    error: [],
    users: [],
  }

  componentDidMount = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed.name) {
      this.setState({ userName: parsed.name });
      this.showUsers(parsed.name);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const parsed = queryString.parse(nextProps.location.search);
    if (parsed.name) {
      this.setState({ userName: parsed.name });
      this.showUsers(parsed.name);
    } else {
      this.setState({ userName: '', error: [], users: [] });
    }
  }

  showUsers = (search) => {
    const url = `/api/profile/${search}`;
    axios({ url, method: 'GET' })
    .then(({ data: { error, users } }) => {
      if (error) {
        this.setState({ error, users: [] });
      } else {
        this.setState({ error: '', users });
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const search = this.state.userName;
    const { pathname } = this.props.location;
    const newUrl = `${pathname}?name=${search}`;
    this.props.history.push(newUrl);
    this.showUsers(search);
  }

  saveState = (name, value) => {
    this.setState({ [name]: value });
  }

  render() {
    const { error, users } = this.state;
    const errorMessage = error.length === 0 ? '' : error[0].msg;
    const search = this.state.userName;

    let usersDisplay = '';
    if (users) {
      usersDisplay = users.map((user) => {
        const { _id: id } = user;
        return (
          <Link to={`/profile/${id}`} className="one-user-search-display" key={id}>
            <img
              className="profile-pic-search"
              src={`/static/uploads/${user.profile.picture}`}
              alt="profile-pic"
            />
            <span>{user.profile.firstName} </span>
            <span>{user.profile.lastName}</span>
          </Link>
        );
      });
    }
    return (
      <div className="search-user-container">
        <form id="user-form" onSubmit={this.handleSubmit}>
          <TextInput
            currentValue={search}
            name="userName"
            type="text"
            id="profile.searchMessage"
            className="search-user-input"
            onChange={this.saveState}
            autocomplete="off"
          />
        </form>
        <SubmitForm
          className="btn btn-default submit-button"
          id="general.search"
        />
        <div className="users-search-display">
          {usersDisplay}
        </div>
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
      </div>
    );
  }
}

export default FindUser;
