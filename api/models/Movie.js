import mongoose from 'mongoose';

const torrentsSchema = new mongoose.Schema({
  url: { type: String },
  magnet: { type: String },
  seed: { type: Number },
  leech: { type: Number },
  peer: { type: Number },
});

const Torrents = mongoose.model('Torrents', torrentsSchema);

const movieSchema = new mongoose.Schema({
  idImdb: { type: String, unique: true },
  torrents: [Torrents],
  title: [String],
  year: Number,
  overview: [String],
  genres: [[String]],
  runtime: Number,
  director: String,
  cast: [String],
  rating: Number,
  posterLarge: String,
  thumb: String,
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
