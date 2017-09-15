import React, { Component } from 'react';

const styles = {
  name: {
    width: '70px',
    display: 'inline-block',
  },
  infos: {
    width: '240px',
    display: 'inline-block',
  },
  pencil: {
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
  },
};

export default class UpdateMyInfos extends Component {

  state = {
    changeEmail: false,
    changeName: false,
  }

  handleClick = (event) => {
    const id = event.target.id;
    if (id === 'name') {
      this.setState({ changeName: true });
    } else if (id === 'email') {
      this.setState({ changeEmail: true });
    }
  }

  render() {
    const { firstName, lastName } = this.props.user.profile;
    const { email } = this.props.user;
    // const { changeEmail, changeName } = this.state;

    return (
      <div style={styles.infos}>
        <div>
          <span style={styles.name}><b>Name</b></span>
          <span>{firstName} {lastName}</span>
          <button id="name" style={styles.pencil} onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
        <div>
          <span style={styles.name}><b>Contact</b></span>
          <span>{email}</span>
          <button id="email" style={styles.pencil} onClick={this.handleClick} className="glyphicon glyphicon-pencil" />
        </div>
      </div>
    );
  }

}
