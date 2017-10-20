import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import TextInput from '../../General/components/TextInput.js';

const DEFAULT_IMG = '/static/uploads/empty_profile.png';

class FindUser extends Component {

  state = {
    userName: '',
    error: [{ param: '', msg: '' }],
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
      this.setState({ userName: '', error: [{ param: '', msg: '' }], users: [] });
    }
  }

  showUsers = (search) => {
    const url = `/api/profile/${search}`;
    axios({ url, method: 'GET' })
    .then(({ data: { error, users } }) => {
      if (error.length) {
        this.setState({ error, users: [] });
      } else {
        this.setState({ error: [{ param: '', msg: '' }], users });
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const search = this.state.userName;
    const { pathname } = this.props.location;
    const newUrl = `${pathname}?name=${search}`;
    this.props.history.push(newUrl);
  }

  saveState = (name, value) => {
    this.setState({ [name]: value });
  }

  render() {
    const { error, users } = this.state;
    const errorMessage = error[0].msg ? this.props.intl.formatMessage({ id: error[0].msg }) : '';
    const search = this.state.userName;

    let usersDisplay = '';
    if (users) {
      usersDisplay = users.map((user) => {
        const { _id: id } = user;
        return (
          <Link to={`/profile/${id}`} className="one-user-search-display" key={id}>
            <img
              className="profile-pic-search"
              src={user.profile.pictureURL || DEFAULT_IMG}
              alt="profile-pic"
              onError={e => (e.target.src = DEFAULT_IMG)}
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
        <div className="users-search-display">
          {usersDisplay}
        </div>
        <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
      </div>
    );
  }
}

export default injectIntl(FindUser);
