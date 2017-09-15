import React, { Component } from 'react';
// import axios from 'axios';

import UpdateMyInfos from './UpdateMyInfos.js';

export default class UpdateInfos extends Component {

  state = {
    error: '',
    email: '',
    firstName: '',
    lastName: '',
  }

  // updateInfos = () => {
  //   const infos = Object.assign({}, this.state);
  //   const url = '/api/me';
  //   axios.post(url, infos)
  //   .then(({ data }) => {
  //     const { success, error } = data;
  //     console.log(success, error);
  //   })
  //   .catch(err => console.error('Error: ', err));
  // }

  // handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  render() {
    const { user } = this.props;

    return (
      <UpdateMyInfos
        user={user}
      />
    );
  }

}
