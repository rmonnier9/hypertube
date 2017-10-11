import React, { Component } from 'react';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import UpdateMyInfos from './UpdateMyInfos.js';
import FindUser from './FindUser.js';
import ProfilePic from '../components/ProfilePic.js';
import Loading from '../../General/components/Loading';
import '../css/profile.css';

class MyProfile extends Component {

  state = {
    profileLoaded: false,
    error: [],
    errorPic: [{ param: '', msg: '' }],
    status: 'closed',
    file: {},
    picture: '',
    otherUser: {},
  }

  componentDidMount() {
    const url = '/api/me';
    axios({ url, method: 'GET' })
    .then(({ data: { error, user } }) => {
      if (error.length) {
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

  handleClose = () => {
    this.setState({ status: 'closed' });
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
    .then(({ data: { errorPic, picture } }) => {
      if (errorPic.length) {
        this.setState({ status: 'open', errorPic });
      } else {
        this.setState({ status: 'closed', picture, errorPic: [{ param: '', msg: '' }] });
      }
    });
  }

  render() {
    const {
      profileLoaded,
      error,
      errorPic,
      picture,
      status,
      file,
    } = this.state;

    if (error.length) { return (<div>{error}</div>); } // no error backend
    if (!profileLoaded) { return <Loading />; }

    return (
      <div className="profile-container">
        <h1 className="profile-title">
          <FormattedMessage
            id="profil.profil"
            defaultMessage="Profile"
          />
        </h1>
        <ProfilePic
          user={this.user}
          picture={picture}
          handleUpload={this.imageUpload}
          handleSubmit={this.handleSubmit}
          handleOpen={this.handleOpen}
          handleClose={this.handleClose}
          status={status}
          file={file}
          errorPic={errorPic}
        />
        <UpdateMyInfos user={this.user} />
        <FindUser
          location={this.props.location}
          history={this.props.history}
        />
      </div>
    );
  }

}

export default MyProfile;
