import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

const style = {
  dropzone: {
    margin: '20px',
    borderStyle: 'solid',
    borderWidth: 'medium',
    width: '200px',
    height: '200px',
    display: 'inherit',
    alignItems: 'inherit',
    justifyContent: 'inherit',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    width: '200px',
    height: '200px',
  },
};

class UploadPicture extends Component {

  handleDrop = (filename) => {
    this.props.handleUpload(filename[0]);
  }

  render() {
    console.log('prop', this.props);
    const preview = this.props.file.preview
     ? <img style={style.preview} src={this.props.file.preview} alt="" />
     : null;
    return (
      <div style={style.container}>
        {preview}
        <Dropzone
          multiple={false}
          accept="image/jpeg, image/png"
          onDrop={this.handleDrop}
          style={style.dropzone}
        >
          <span>Upload a profile picture</span>
        </Dropzone>
      </div>
    );
  }
}

export default UploadPicture;
