import React, { Component } from 'react';

class Switcher extends Component {

  render() {
    return (
      <ul className="nav nav-tabs">
        <li role="presentation" onClick={this.props.switchTab('yifi')}>
          <a href="">Yifi</a>
        </li>
        <li role="presentation" onClick={this.props.switchTab('eztv')}>
          <a href="">Eztv</a>
        </li>
      </ul>
    );
  }
}

export default Switcher;
