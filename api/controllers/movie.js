import Movie from '../models/Movie';

export const getInfos = (req, res, next) => {
  const { idImdb } = req.params;
  Movie.findOne({ idImdb }, (err, movie) => {
    if (err) { return next(err); }
    console.log(movie);
    return res.send({ error: '', movie });
  });
};
