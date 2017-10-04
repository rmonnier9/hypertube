import React, { Component } from 'react';
import '../css/comment.css';

class CommentBlock extends Component {

  render() {
    return (
      <div className="comment-block">
        {this.props.children}
      </div>
    );
  }
}

export default CommentBlock;
