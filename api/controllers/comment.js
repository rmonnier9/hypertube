import moment from 'moment';
import { Comment, ListComment } from '../models/Comment';
import User from '../models/User';

const createCommentObject = async ({ comment }, idUser) => {
  const newComment = new Comment({
    idUser,
    date: moment(),
    text: comment,
  });
  return newComment;
};

const addUserProps = async ({ comments }) => (
  Promise.all(comments.map(async (comment) => {
    const { profile } = await User.findOne({ _id: comment.idUser });
    const object = {
      id: comment._id,
      idUser: comment.idUser,
      date: comment.date,
      text: comment.text,
      pictureURL: profile.pictureURL || '/static/uploads/empty_profile.png',
      firstName: profile.firstName || 'John',
      lastName: profile.lastName || 'Doe',
    };
    return object;
  }))
);

/**
 * POST /api/comment/:idImdb
 * Post comment on the specified movie
 */

export const addComment = async (req, res) => {
  const { idImdb } = req.params;
  const newComment = await createCommentObject(req.body, req.user.id);
  const list = await ListComment.findOneAndUpdate(
    { idImdb },
    { $push: { comments: newComment } },
    { upsert: true,
      new: true,
    },
  );
  const results = await addUserProps(list);
  return res.send({ error: '', comments: results });
};

/**
 * GET /api/comment/:idImdb
 * Get comments on the specified movie
 */

export const getComment = async (req, res) => {
  const { idImdb } = req.params;
  const list = await ListComment.findOne({ idImdb });
  if (!list) return res.send({ error: '', comments: [] });
  const result = await addUserProps(list);
  return res.send({ error: '', comments: result });
};
