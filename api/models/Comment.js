const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  idUser: String,
  date: Date,
  text: String,
});

const Comment = mongoose.model('Comment', commentSchema);

module.export = Comment;

const ListCommentSchema = new mongoose.Schema({
  idImdb: { type: String, unique: true },
  comments: [commentSchema],
});

const ListComment = mongoose.model('ListComment', ListCommentSchema);

module.exports = ListComment;
