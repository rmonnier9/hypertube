import React, { Component } from 'react';
import Dialog from './Dialog.js';

const styles = {
  picture: {
    width: '240px',
    height: '240px',
  },
  upload: {
    display: 'flex',
    alignItems: 'center',
  },
  camera: {
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
  },
};

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
        <div style={styles.upload}>
          <span>Upload a new profile picture</span>
          <button
            style={styles.camera}
            className="material-icons"
            onClick={this.props.handleOpen}
          >
          camera_enhance
          </button>
        </div>
        <div style={styles.picture}>
          <img src={path} alt="" />
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
