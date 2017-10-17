import React, { Component } from 'react';
import axios from 'axios';
import { injectIntl } from 'react-intl';
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
    pictureURL: '',
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
    .then(({ data: { errorPic, pictureURL } }) => {
      if (errorPic.length) {
        this.setState({ status: 'open', errorPic });
      } else {
        this.setState({ status: 'closed', pictureURL, errorPic: [{ param: '', msg: '' }] });
      }
    });
  }

  render() {
    const {
      profileLoaded,
      error,
      errorPic,
      pictureURL,
      status,
      file,
    } = this.state;

    const profile = this.props.intl.formatMessage({ id: 'profile.profile' });

    if (error.length) { return (<div>{error}</div>); } // no error backend
    if (!profileLoaded) { return <Loading />; }

    return (
      <div className="profile-container my-profile">
        <h1 className="profile-title">{profile}</h1>
        <ProfilePic
          user={this.user}
          pictureURL={pictureURL}
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

export default injectIntl(MyProfile);
