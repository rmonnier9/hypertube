const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  count: Number,
  en: String,
  fr: String,
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
