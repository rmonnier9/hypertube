import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

class TextInput extends Component {

  handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value.trim();
    this.props.onChange(name, value);
  }

  render() {
    const { currentValue, name, type, id = '' } = this.props;
    const className = this.props.className || '';
    const autocomplete = this.props.autocomplete || '';
    const placeholder = this.props.placeholder || '';
    const classNameInput = `form-control ${className}`;
    const label = !id ? '' : this.props.intl.formatMessage({ id });
    const placeholderValue = !placeholder ? '' : this.props.intl.formatMessage({ id: placeholder });
    return (
      <div className="">
        <label htmlFor={name} className="input-label">{label}</label>
        <input
          className={classNameInput}
          value={currentValue}
          name={name}
          type={type}
          onChange={this.handleChange}
          autoComplete={autocomplete}
          placeholder={placeholderValue}
        />
      </div>
    );
  }
}

export default injectIntl(TextInput);
