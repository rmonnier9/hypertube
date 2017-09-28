import React, { Component } from 'react';
import '../css/Switcher.css';

const activeClass = 'switcher switcher-active';

const inactiveClass = 'switcher switcher-inactive';

const tab = (className, source, props) => (
  <li key={source} className={className} >
    <button
      className="switcher-button"
      onClick={(e) => { props.onSwitch(e, source); }}
    >
      {source}
    </button>
  </li>
);


class Switcher extends Component {

  render() {
    const { active, sources } = this.props;
    const items = sources.map((source) => {
      if (active === source) return tab(activeClass, source, this.props);
      return tab(inactiveClass, source, this.props);
    });
    return (
      <ul className="nav nav-tabs">
        {items}
      </ul>
    );
  }
}

export default Switcher;
