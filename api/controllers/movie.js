import Movie from '../models/Movie';
import User from '../models/User';

/**
 * GET /api/movie/info/:idImdb
 * Get info about the specified movie
 */

export const getInfos = (req, res, next) => {
  const { idImdb } = req.params;
  Movie.findOne({ idImdb }, (err, movie) => {
    if (err) {
      return next(err);
    } else if (movie === null) {
      return res.send({ error: [{ param: 'movie', msg: 'error.noMovie' }] });
    }
    User.findById(req.user.id, (err, user) => {
      if (err) { return next(err); }
      user.password = '';
      return res.send({ error: [], user, movie });
    });
  });
};

export default getInfos;
