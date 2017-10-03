import React, { Component } from 'react';
import Dialog from '../../HomePage/components/Dialog.js';

export default class ProfileProfile extends Component {

  handleDrop = (filename) => {
    this.props.handleUpload(filename[0]);
  }

  render() {
    const { picture } = this.props;
    const path = picture ?
    `/static/uploads/${picture}` :
    `/static/uploads/${this.props.user.profile.picture}`;
    return (
      <div>
        <div className="profile-pic">
          <img src={path} alt="" />
        </div>
        <div className="upload-new-pic">
          <span>Upload a new profile picture</span>
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
          error={this.props.errorPic}
          status={this.props.status}
          file={this.props.file}
        />
      </div>
    );
  }

}
