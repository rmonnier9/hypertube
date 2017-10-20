import React, { Component } from 'react';
import { CommentBlock } from './CommentList';
import TextInput from '../../General/components/TextInput';
import '../css/comment.css';

class CommentInput extends Component {

  state = { text: '' };

  saveInput = (name, value) => {
    this.setState({ text: value });
  }

  sendInput = (e) => {
    e.preventDefault();
    e.target.reset();
    const { text } = this.state;
    if (text) {
      this.props.onAdd(text);
    }
  }

  render() {
    return (
      <CommentBlock>
        <form id="comment-form" onSubmit={this.sendInput} >
          <TextInput
            className="comment-input"
            name="comment"
            type="text"
            onChange={this.saveInput}
            placeholder="comments.typeComment"
            maxLength="1000"
          />
        </form>
      </CommentBlock>
    );
  }
}

export default CommentInput;
