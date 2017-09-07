import React, { Component } from 'react';
import axios from 'axios';

class MyProfile extends Component {
  state = {
    profileLoaded: false,
    error: '',
  }

  componentDidMount() {
    const url = '/api/me';
    axios({ url, method: 'GET' })
    .then(({ data: { error, user } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.user = user;
        this.setState({
          profileLoaded: true,
        });
      }
    });
  }

  render() {
    // console.log("render", this.state)
    const {
      profileLoaded,
      error,
    } = this.state;

    if (error || !profileLoaded) {
      return (<div><h1>{error || 'Loading...'}</h1></div>);
    }
    return (
      <div className="profile">
        <h1>{this.user.email} is logged !</h1>
      </div>
    );
  }

}


export default MyProfile;
