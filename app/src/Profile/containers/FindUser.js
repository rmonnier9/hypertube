import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TextInput from '../../General/components/TextInput.js';
import SubmitForm from '../../General/components/SubmitForm.js';

class FindUser extends Component {

  state = {
    userName: '',
    error: [],
    users: [],
  }

  handleSubmit = (event) => {
    event.preventDefault(event);
    const { userName } = this.state;
    const url = `/api/profile/${userName}`;
    axios({ url, method: 'GET' })
    .then(({ data: { error, users } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ error: '', users });
        console.log(users);
      }
    });
  }

  saveState = (name, value) => {
    this.setState({ [name]: value });
  }

  render() {
    const { error, users } = this.state;
    const errorMessage = error.length === 0 ? '' : error[0].msg;
    let usersDisplay = '';
    if (users) {
      usersDisplay = users.map(user => (
        <Link to={`/profile/${user._id}`} className="one-user-search-display" key={user._id}>
          <img
            className="profile-pic-search"
            src={`/static/uploads/${user.profile.picture}`}
            alt="profile-pic"
          />
          <span>{user.profile.firstName} </span>
          <span>{user.profile.lastName}</span>
        </Link>
      ));
    }

    return (
      <div className="search-user-container">
        <form id="user-form" onSubmit={this.handleSubmit}>
          <TextInput
            name="userName"
            type="text"
            text="Enter a name to find another user"
            className="search-user-input"
            onChange={this.saveState}
          />
        </form>
        <SubmitForm
          className="btn btn-default submit-button"
          value="Search"
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
