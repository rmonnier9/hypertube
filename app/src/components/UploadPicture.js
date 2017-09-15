import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

const styles = {
  dropzone: {
    margin: '20px',
    borderStyle: 'solid',
    borderWidth: 'medium',
    width: '200px',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    objectFit: 'cover',
    width: '200px',
    height: '200px',
  },
  icons: {
    fontSize: '48px',
  },
};

class UploadPicture extends Component {

  handleDrop = (filename) => {
    this.props.handleUpload(filename[0]);
  }

  render() {
    const preview = this.props.file.preview
     ? <img style={styles.preview} src={this.props.file.preview} alt="" />
     : null;
    return (
      <div style={styles.container}>
        {preview}
        <Dropzone
          multiple={false}
          accept="image/jpeg, image/png"
          onDrop={this.handleDrop}
          style={styles.dropzone}
        >
          <div>
            <i className="material-icons" style={styles.icons}>camera_enhance</i>
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
