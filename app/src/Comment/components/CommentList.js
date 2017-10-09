import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import '../css/comment.css';

const dateFormat = 'MMM Do YYYY, h:mm a';

const capFirst = string => (
  string.charAt(0).toUpperCase() + string.slice(1)
);

export const CommentBlock = ({ children }) => (
  <div className="comment-block">
    {children}
  </div>
);

const Comment = ({ comment }) => (
  <div className="comment">
    <a title="View profile" href={`/profile/${comment.idUser}`}>
      <img className="comment-avatar" src={`/static/uploads/${comment.picture}`} alt="" />
    </a>
    <div className="comment-text-container">
      <div className="comment-info">
        <div>{`${capFirst(comment.firstName)} ${capFirst(comment.lastName)} `}</div>
        <div className="comment-date">{ moment(comment.date).format(dateFormat) }</div>
      </div>
      <p className="comment-text">{comment.text}</p>
    </div>
  </div>
);

class CommentList extends Component {

  render() {
    const ifOne = this.props.intl.formatMessage({ id: 'comments.ifOne' });
    const { comments } = this.props;
    if (!comments || !comments.length) {
      return (
        <CommentBlock>
          { ifOne }
        </CommentBlock>
      );
    }
    return (
      <div>
        {comments.map(comment => (
          <CommentBlock key={comment.id}>
            <Comment comment={comment} />
          </CommentBlock>
      ))}
      </div>
    );
  }
}

export default injectIntl(CommentList);
