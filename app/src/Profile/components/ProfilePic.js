import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Dialog from '../../HomePage/components/Dialog.js';

export default class ProfileProfile extends Component {

  handleDrop = (filename) => {
    this.props.handleUpload(filename[0]);
  }

  render() {
    const { pictureURL } = this.props;
    const path = pictureURL || this.props.user.profile.pictureURL || '/static/uploads/empty_profile.png';

    return (
      <div>
        <div>
          <img className="profile-pic" src={path} alt="profile-pic" />
        </div>
        <div className="upload-new-pic">
          <FormattedMessage
            id="profile.uploadPic"
            defaultMessage="Upload a new profile picture"
          />
          <button
            className="material-icons camera-icon"
            onClick={this.props.handleOpen}
          >
            camera_enhance
          </button>
        </div>
        <Dialog
          preview={this.props.preview}
          handleUpload={this.props.handleUpload}
          handleSubmit={this.props.handleSubmit}
          handleClose={this.props.handleClose}
          error={this.props.errorPic}
          status={this.props.status}
          file={this.props.file}
        />
      </div>
    );
  }

}
