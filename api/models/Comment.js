import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  idImdb: String,
  idUser: String,
  date: { type: Date, default: Date.now },
  text: String,
  userPhoto: String,
  userFirstName: String,
  userLastName: String,
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
