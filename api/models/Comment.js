import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  idUser: String,
  date: Date,
  text: String,
});

export const Comment = mongoose.model('Comment', commentSchema);

const ListCommentSchema = new mongoose.Schema({
  idImdb: { type: String, unique: true },
  comments: [commentSchema],
});

export const ListComment = mongoose.model('ListComment', ListCommentSchema);
