import React, { Component } from 'react';
import axios from 'axios';
import { FormattedPlural, injectIntl } from 'react-intl';
import CommentList from '../components/CommentList';
import CommentInput from '../components/CommentInput';

class CommentTable extends Component {

  constructor(props) {
    super(props);
    this.targetId = props.originId;
    this.state = { loaded: false, open: false };
  }

  componentDidMount() {
    this.getComment(this.targetId);
  }

  handleOpen = (e) => {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  }

  getComment = (targetId) => {
    const url = `/api/comment/${targetId}`;
    axios.get(url)
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
    const url = `/api/comment/${this.targetId}`;
    axios.post(url, { comment })
    .then(({ data: { error, comments } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ comments });
      }
    });
  }

  render() {
    const { comments, open, loaded } = this.state;
    const { formatMessage } = this.props.intl;
    if (!loaded) return null;
    return (
      <div className="comment-container">
        <h4>
          <i className="glyphicon glyphicon-comment comment-icon" />
          <a className="comment-count" href="" onClick={this.handleOpen}>
            {` ${comments.length} `}
            <FormattedPlural
              value={comments.length}
              one={formatMessage({ id: 'comments.comment' })}
              other={formatMessage({ id: 'comments.comments' })}
            />
          </a>
        </h4>
        { !open ? null :
        <div>
          <CommentList comments={comments} />
          <CommentInput onAdd={this.addComment} />
        </div>
        }
      </div>
    );
  }
}

export default injectIntl(CommentTable);
