import React, { Component } from 'react';
import axios from 'axios';

import UpdateInfos from './UpdateInfos.js';
import ProfilePic from '../components/ProfilePic.js';

const styles = {
  profile: {
    margin: '10px',
  },
};

export default class MyProfile extends Component {

  state = {
    profileLoaded: false,
    error: '',
    status: 'closed',
    file: {},
    picture: '',
  }

  componentDidMount() {
    const url = '/api/me';
    axios({ url, method: 'GET' })
    .then(({ data: { error, user } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.user = user;
        this.setState({
          profileLoaded: true,
        });
      }
    });
  }

  handleOpen = () => {
    this.setState({ status: 'open' });
  }

  imageUpload = (file) => { this.setState({ file }); }

  sendPicture = (file) => {
    const form = new FormData();
    form.append('imageUploaded', file);
    const headers = { 'Content-Type': 'multipart/form-data' };
    const config = {
      url: '/api/profile_pic',
      method: 'POST',
      data: form,
      headers,
    };
    return axios(config);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { file } = this.state;
    this.sendPicture(file)
    .then(({ data: { error, picture } }) => {
      if (error) this.setState({ status: 'open', error });
      else {
        this.setState({ status: 'closed', picture });
      }
    });
  }

  render() {
    const {
      profileLoaded,
      error,
      picture,
      status,
      file,
    } = this.state;

    if (error || !profileLoaded) {
      return (<div><h1>{error || 'Loading...'}</h1></div>);
    }
    return (
      <div style={styles.profile}>
        <h1>Profile</h1>
        <ProfilePic
          user={this.user}
          picture={picture}
          handleUpload={this.imageUpload}
          handleSubmit={this.handleSubmit}
          handleOpen={this.handleOpen}
          status={status}
          file={file}
        />
        <UpdateInfos user={this.user} />
      </div>
    );
  }

}
