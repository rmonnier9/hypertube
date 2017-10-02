import React, { Component } from 'react';

class TextInput extends Component {

  handleChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value.trim();
    this.props.onChange(name, value);
  }

  render() {
    const { currentValue, name, type, text } = this.props;
    const className = this.props.className || '';
    const classNameInput = `form-control ${className}`;

    return (
      <div className="">
        <label htmlFor={name} className="input-label">{text}</label>
        <input
          className={classNameInput}
          defaultValue={currentValue}
          name={name}
          type={type}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default TextInput;
