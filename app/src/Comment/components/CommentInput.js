import React, { Component } from 'react';
import CommentBlock from './CommentBlock';
import TextInput from '../../General/components/TextInput';
import '../css/comment.css';

class CommentInput extends Component {

  state = { text: '' };

  componentDidMount() {
    document.getElementsByClassName('comment-input')[0].setAttribute('placeholder', 'Type your comment');
  }

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
          />
        </form>
      </CommentBlock>
    );
  }
}

export default CommentInput;
