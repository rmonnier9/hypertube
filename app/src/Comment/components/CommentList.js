import React, { Component } from 'react';
import CommentBlock from './CommentBlock';

class CommentList extends Component {

  render() {
    const { comments } = this.props;
    if (!comments) {
      return (
        <CommentBlock>
          Be the first to comment this movie !
        </CommentBlock>
      );
    }
    return comments.map(comment => (
      <CommentBlock key={comment.id}>
        {comment.text}
      </CommentBlock>
    ));
  }
}

export default CommentList;
