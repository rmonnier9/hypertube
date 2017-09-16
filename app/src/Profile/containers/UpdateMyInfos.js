import axios from 'axios';
import React, { Component } from 'react';
import TextInput from '../components/TextInput.js';
import SubmitForm from '../components/SubmitForm.js';

class UpdateMyInfos extends Component {

  state = {
    error: '',
    email: '',
    firstName: '',
    lastName: '',
    changeEmail: false,
    changeName: false,
  }

  saveState = (name, value) => {
    this.setState({ [name]: value });
  }

  handleClick = (event) => {
    const id = event.target.id;
    if (id === 'name') {
      this.setState({ changeName: true, changeEmail: false });
    } else if (id === 'email') {
      this.setState({ changeEmail: true, changeName: false });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const id = event.target.id;
    let infos;
    if (id === 'name-form') {
      infos = { firstName: this.state.firstName, lastName: this.state.lastName };
    } else if (id === 'email-form') {
      infos = { email: this.state.email };
    }
    const url = '/api/me'; // back not done
    axios.post(url, infos)
    .then(({ data }) => {
      const { success, error } = data;
      console.log(success, error);
    })
    .catch(err => console.error('Error: ', err));
  }

  render() {
    const { firstName, lastName } = this.props.user.profile;
    const { email } = this.props.user;
    const { changeEmail, changeName } = this.state;
    let formEmail;
    let formName;
    if (changeEmail) {
      formEmail = (<form id="email-form" onSubmit={this.handleSubmit}>
        <TextInput
          currentValue={email}
          name="email"
          type="email"
          text="New contact email"
          onChange={this.saveState}
        />
        <SubmitForm value="Save" />
      </form>);
    } else if (changeName) {
      formName = (<form id="name-form" onSubmit={this.handleSubmit}>
        <TextInput
          currentValue={firstName}
          name="firstName"
          type="text"
          text="First name"
          onChange={this.saveState}
        />
        <TextInput
          currentValue={lastName}
          name="lastName"
          type="text"
          text="Last name"
          onChange={this.saveState}
        />
        <SubmitForm value="Save" />
      </form>);
    }

    return (
      <div className="infos-container">
        <div>
          <span className="infos-title"><b>Name</b></span>
          <span>{firstName} {lastName}</span>
          <button id="name" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        <div>
          <span className="infos-title"><b>Contact</b></span>
          <span>{email}</span>
          <button id="email" onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        {formEmail}
        {formName}
      </div>
    );
  }
}

export default UpdateMyInfos;
