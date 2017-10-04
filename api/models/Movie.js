import mongoose from 'mongoose';

const torrentSchema = new mongoose.Schema({
  hash: { type: String, unique: true }, // for key
  url: String, // yifi
  magnet: String, // eztv
  title: {
    en: String,
    fr: String,
  },
  quality: String,
  episode: String,
  season: String,
  size: String,
  seeds: Number,
  peers: Number,
  source: String, // yifi or eztv
});

export const Torrent = mongoose.model('Torrent', torrentSchema);

const movieSchema = new mongoose.Schema({
  idImdb: { type: String, unique: true },
  torrents: [
    torrentSchema
  ],
  title: {
    en: String,
    fr: String,
  },
  year: Number,
  overview: {
    en: String,
    fr: String,
  },
  genres: [{
    en: String,
    fr: String,
  }],
  runtime: Number,
  director: String,
  stars: [String],
  rating: Number,
  posterLarge: String,
  thumb: String,
});

export const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
