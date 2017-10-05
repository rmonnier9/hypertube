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

// originaly i tried to do with this function which did not work for an unknown reason
// the result of object2 are not comprehensible

// const addUserProps2 = async ({ comments }) => (
//   Promise.all(comments.map(async (comment) => {
//     const { profile } = await User.findOne({ _id: comment.idUser });
//     console.log('profile', profile);
//     console.log('comment', comment);
//     const object = Object.assign(comment, profile);
//     const object2 = Object.assign({}, comment, profile);
//     console.log('new comment', comment);
//     console.log('object', object); // object doesnt have profile property
//     console.log('object2', object2); // object2 has mangoose cursor stuff !
//     return object;
//   }))
// );


const addUserProps = async ({ comments }) => (
  Promise.all(comments.map(async (comment) => {
    const { profile } = await User.findOne({ _id: comment.idUser });
    const object = {
      id: comment._id,
      idUser: comment.idUser,
      date: comment.date,
      text: comment.text,
      picture: profile.picture,
      lastName: profile.lastName,
      firstName: profile.firstName,
    };
    return object;
  }))
);

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

export const getComment = async (req, res) => {
  const { idImdb } = req.params;
  const list = await ListComment.findOne({ idImdb });
  if (!list) return res.send({ error: '', comments: [] });
  const result = await addUserProps(list);
  return res.send({ error: '', comments: result });
};
