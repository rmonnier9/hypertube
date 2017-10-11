import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import { injectIntl } from 'react-intl';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import UploadPicture from './UploadPicture';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class CustomDialog extends Component {

  state = {
    open: false,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = nextProps;
    this.setState({ open: status === 'open' });
  }

  handleClose = () => {
    this.setState({ open: false });
    if (this.props.handleClose !== undefined) {
      this.props.handleClose();
    }
  };

  render() {
    const file = this.props.file === undefined ? {} : this.props.file;
    const preview = this.props.file === undefined ? null : this.props.file.preview;
    let error;
    if (this.props.error[0].msg) {
      error = this.props.intl.formatMessage({ id: this.props.error[0].msg });
    } else if (this.props.file === undefined) {
      error = this.props.intl.formatMessage({ id: 'error.imageOnly' });
    } else {
      error = '';
    }

    const cancel = this.props.intl.formatMessage({ id: 'general.cancel' });
    const submit = this.props.intl.formatMessage({ id: 'general.submit' });

    const actions = [
      <FlatButton
        label={cancel}
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        label={submit}
        primary
        disabled={!preview}
        onClick={this.props.handleSubmit}
      />,
    ];

    if (this.props.status === 'loading') return <CircularProgress />;

    return (
      <div>
        <Dialog
          actions={actions}
          modal
          open={this.state.open}
        >
          <UploadPicture
            file={file}
            handleUpload={this.props.handleUpload}
          />
          <p style={{ color: 'red' }}>{error}</p>
        </Dialog>
      </div>
    );
  }
}

export default injectIntl(CustomDialog);
