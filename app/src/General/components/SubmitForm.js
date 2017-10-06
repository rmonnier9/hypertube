import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

class SubmitForm extends Component {

  render() {
    const { className, id } = this.props;
    const value = this.props.intl.formatMessage({ id });
    return (
      <input
        type="submit"
        className={className}
        value={value}
      />
    );
  }
}

export default injectIntl(SubmitForm);
