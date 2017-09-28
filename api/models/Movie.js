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
  year: { type: Number },
  overview: [String],
  genres: [[String]],
  runtime: { type: Number },
  director: { type: String },
  cast: [String],
  rating: { type: Number },
  posterLarge: { type: String },
  thumb: { type: String },
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
