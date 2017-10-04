import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
  count: Number,
  en: String,
  fr: String,
});

const Genre = mongoose.model('Genre', genreSchema);

export default Genre;
