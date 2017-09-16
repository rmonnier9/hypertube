import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

class UploadPicture extends Component {

  handleDrop = (filename) => {
    this.props.handleUpload(filename[0]);
  }

  render() {
    const preview = this.props.file.preview
     ? <img className="picture-preview" src={this.props.file.preview} alt="" />
     : null;
    return (
      <div className="dropzone-container">
        {preview}
        <Dropzone
          multiple={false}
          accept="image/jpeg, image/png"
          onDrop={this.handleDrop}
          className="dropzone"
        >
          <div>
            <i className="material-icons signup-camera-icon">camera_enhance</i>
          </div>
          <div>
            <p>Upload a profile picture</p>
          </div>
        </Dropzone>
      </div>
    );
  }
}

export default UploadPicture;
