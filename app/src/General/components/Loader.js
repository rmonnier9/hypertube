import React, { Component } from 'react';

class Loader extends Component {
  state = { status: '' };

  componentDidMount() {
    this.inter = setInterval(() => {
      const { status } = this.state;
      if (status === '....') this.setState({ status: '' });
      else this.setState({ status: `${this.state.status}.` });
    }, 300);
  }

  componentWillUnmount() {
    clearInterval(this.inter);
  }

  render() {
    return <span>{this.state.status}</span>;
  }
}

export default Loader;
