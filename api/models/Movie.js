import mongoose from 'mongoose';

const torrentsSchema = new mongoose.Schema({
  url: String, // yifi
  magnet: String, // eztv
  title: String, // eztv
  hash: String, // for key
  quality: String,
  size: String,
  seeds: Number,
  peers: Number,
  source: String, // yifi or eztv
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
