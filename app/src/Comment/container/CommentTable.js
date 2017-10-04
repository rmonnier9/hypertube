import React, { Component } from 'react';
import axios from 'axios';
import CommentList from '../components/CommentList';
import CommentInput from '../components/CommentInput';

class CommentTable extends Component {

  constructor(props) {
    super(props);
    this.target = props.origin;
    this.targetId = props.originId;
    this.state = { loaded: false };
  }

  componentDidMount() {
    // this.getComment(this.state.target);
    this.getGenreTable();
  }

  getGenreTable = () => {
    const url = '/api/genres';
    axios({
      url,
      method: 'GET',
    })
    .then(({ data: { genre } }) => {
      console.log('genreTable', genre);
    });
  }

  getComment = (target) => {
    const url = `/api/comment/${target}`;
    axios.get({
      url,
    })
    .then(({ data: { error, comments } }) => {
      if (error) {
        this.setState({ error, loaded: true });
      } else {
        this.setState({
          loaded: true,
          comments,
        });
      }
    });
  }

  addComment = (comment) => {
    const url = `/api/comment/${this.originId}`;
    const payload = { comment };
    console.log(comment);
    axios.post({
      url,
      payload,
    })
    .then(({ error, comments }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ comments });
      }
    });
  }

  render() {
    const { comments } = this.state;
    return (
      <div>
        <CommentList comments={comments} />
        <CommentInput onAdd={this.addComment} />
      </div>
    );
  }
}

export default CommentTable;
