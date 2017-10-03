import React, { Component } from 'react';
import axios from 'axios';
import TextInput from '../../General/components/TextInput.js';
import SubmitForm from '../../General/components/SubmitForm.js';

class FindUser extends Component {

  state = {
    email: '',
  }

  handleSubmit = (event) => {
    event.preventDefault(event);
    const { email } = this.state;
    const url = `/api/profile/${email}`;
    axios({ url, method: 'GET' })
    .then(({ data: { error, user } }) => {
      if (error) {
        // this.setState({ error });
        console.log(error);
      } else {
        console.log(user);
      }
    });
  }

  saveState = (name, value) => {
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="search-user-container">
        <form id="user-form" onSubmit={this.handleSubmit}>
          <TextInput
            name="email"
            type="email"
            text="Enter an email to find another user"
            className="search-user-input"
            onChange={this.saveState}
          />
          <SubmitForm
            className="btn btn-default submit-button"
            value="Search"
          />
        </form>
      </div>
    );
  }
}

export default FindUser;
