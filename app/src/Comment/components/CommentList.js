import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/min/locales';

import '../css/comment.css';

const dateFormat = { 'en-en': 'MMM Do YYYY, h:mm a', 'fr-fr': 'D MMMM YYYY, H:mm' };

const capFirst = string => (
  string.charAt(0).toUpperCase() + string.slice(1)
);

export const CommentBlock = ({ children }) => (
  <div className="comment-block">
    {children}
  </div>
);

const Comment = ({ comment, locale }) => (
  <div className="comment">
    <a title="View profile" href={`/profile/${comment.idUser}`}>
      <img className="comment-avatar" src={`/static/uploads/${comment.picture}`} alt="" />
    </a>
    <div className="comment-text-container">
      <div className="comment-info">
        <div>{`${capFirst(comment.firstName)} ${capFirst(comment.lastName)} `}</div>
        <div className="comment-date">{ moment(comment.date).locale(locale).format(dateFormat[locale]) }</div>
      </div>
      <p className="comment-text">{comment.text}</p>
    </div>
  </div>
);

const CommentList = (props) => {
  const ifOne = props.intl.formatMessage({ id: 'comments.ifOne' });
  const { comments } = props;

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
          <Comment comment={comment} locale={props.locale} />
        </CommentBlock>
    ))}
    </div>
  );
};

const mapStateToProps = ({ i18n: { locale } }) => ({
  locale,
});

export default connect(mapStateToProps)(injectIntl(CommentList));
