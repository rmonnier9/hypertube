import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/min/locales';

import '../css/comment.css';

const dateFormat = { en: 'MMM Do YYYY, h:mm a', fr: 'D MMMM YYYY, H:mm' };

const capFirst = string => (
  string.charAt(0).toUpperCase() + string.slice(1)
);

export const CommentBlock = ({ children }) => (
  <div className="comment-block">
    {children}
  </div>
);

const Comment = ({ comment, user, locale, lang }) => (
  <div className="comment">
    <img className="comment-avatar" src={user.profile.pictureURL} alt="" />
    <div className="comment-text-container">
      <div className="comment-info">
        <div>{`${capFirst(user.profile.firstName)} ${capFirst(user.profile.lastName)} `}</div>
        <div className="comment-date">{ moment(comment.date).locale(locale).format(dateFormat[lang]) }</div>
      </div>
      <p className="comment-text">{comment.text}</p>
    </div>
  </div>
);

const CommentProfile = (props) => {
  const { comments, user, locale } = props;
  const lang = locale.split('-').pop();

  const display = comments.map(movie => (
    <div key={movie.idImdb} className="movie-comment-block">
      <Link title="View movie" to={`/movie/${movie.idImdb}`}>
        <span className="movie-comment-title">{movie.title[lang]}</span>
      </Link>
      { movie.comments.map((comment) => {
        const { _id: id } = comment;
        return (
          <CommentBlock key={id}>
            <Comment comment={comment} user={user} locale={locale} lang={lang} />
          </CommentBlock>
        );
      })
      }
    </div>
  ));

  return (
    <div className="one-profile-comments">
      {display}
    </div>
  );
};

const mapStateToProps = ({ i18n: { locale } }) => ({
  locale,
});

export default connect(mapStateToProps)(CommentProfile);
