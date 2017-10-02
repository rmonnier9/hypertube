import axios from 'axios';
import parseGenre from './genre';
import { Movie, Torrent } from '../models/Movie';

const keyMovieDb = '92d923e066d13a3034abbbfb0d5ea7ab';

const urlMovieDb = (idImdb, lang) => (
  `https://api.themoviedb.org/3/find/${idImdb}?api_key=${keyMovieDb}&language=${lang}&external_source=imdb_id`
);

const urlImdbApi = idImdb => (
  `http://www.theimdbapi.org/api/movie?movie_id=${idImdb}`
);

const parseTorrent = (torrents, title) => (
  torrents.map(torrent => (
    new Torrent({
      url: torrent.url,
      magnet: '',
      title: {
        en: `${title.en} - ${torrent.quality}`,
        fr: `${title.fr} - ${torrent.quality}`
      },
      hash: torrent.hash,
      quality: torrent.quality,
      size: torrent.size,
      seeds: torrent.seeds,
      peers: torrent.peers,
      source: 'yifi',
    })
  ))
);

const parseMovie = (idImdb, torrents, movieDb, imdbApi) => {
  const title = { en: movieDb.en.title || '', fr: movieDb.fr.title || '' };
  const overview = { en: movieDb.en.overview || 'Unavailable', fr: movieDb.fr.overview || 'Non disponible' };
  const genres = parseGenre(movieDb.en.genre_ids, movieDb.fr.genre_ids);
  const newMovie = new Movie({
    idImdb,
    title,
    genres,
    overview,
    torrents: parseTorrent(torrents, title),
    runtime: parseInt(imdbApi.length, 10),
    director: imdbApi.director,
    stars: imdbApi.stars,
    rating: parseFloat(imdbApi.rating) || 0,
    posterLarge: imdbApi.poster.large,
    thumb: imdbApi.poster.thumb,
    year: parseInt(imdbApi.year, 10),
  });
  return newMovie;
};

const FetchTheMovieDBInfo = async (idImdb, lang) => (
  axios.get(urlMovieDb(idImdb, lang))
    .then(({ data }) => (
      data.movie_results[0]
    ))
    .catch(err => console.error('FetchTheMovieDBInfo err', err.response))
);

const FetchImdbApiInfo = async idImdb => (
  axios.get(urlImdbApi(idImdb))
    .then(({ data }) => (data))
    .catch(err => console.error('FetchImdbApiInfo err', err))
);

const fetchMovieInfo = async ({ torrents, imdb_code: idImdb }) => (
  axios.all([
    FetchTheMovieDBInfo(idImdb, 'en'),
    FetchTheMovieDBInfo(idImdb, 'fr'),
    FetchImdbApiInfo(idImdb),
  ])
    .then(axios.spread((movieDbEn, movieDbFr, imdbApi) => (
      parseMovie(idImdb, torrents, { en: movieDbEn, fr: movieDbFr }, imdbApi)
    )))
    .catch(err => console.error('fetchMovieInfo err', err))
);

export default fetchMovieInfo;
