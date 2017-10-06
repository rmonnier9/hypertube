import React from 'react';
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

const CommentList = ({ comments }) => {
  if (!comments || !comments.length) {
    return (
      <CommentBlock>
        Be the first to comment this movie !
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
};

export default CommentList;
