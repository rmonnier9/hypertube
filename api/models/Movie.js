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
  title: [[String]],
  year: { type: Number },
  overview: [[String]],
  genres: [[String]],
  runtime: { type: Number },
  director: { type: String },
  cast: [String],
  rating: { type: Number },
  posterLarge: { type: String },
  thumb: { type: String },
});

movieSchema.pre('save', function save(next) {
  const movie = this;
  
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});




const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
