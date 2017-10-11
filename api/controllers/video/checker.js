import Movie from '../../models/Movie';

// VIDEO CHECKER
// check input and populate request object
// with req.movie and req.torrent

const videoChecker = async (req, res, next) => {
  // console.log('videoChecker Notice: Request:', req);
  console.log('videoChecker Notice: Query:', req.params);
  console.log('videoChecker Notice: Headers:', req.headers);

  // INPUT CHECK
  const { idImdb, hash } = req.params;
  if (!idImdb) {
    next(new Error('No idImdb.'));
  } else if (!hash) {
    next(new Error('No torrent hash.'));
  }
  const movie = await Movie.findOne({ idImdb, 'torrents.hash': hash }, { idImdb: 1, 'torrents.$': 1 });
  if (!movie) {
    next(new Error('Movie not found.'));
  }
  req.idImdb = movie.idImdb;
  req.torrent = movie.torrents[0];
  next();
};

export default videoChecker;
