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

const parseTorrent = (oldtorrent) => {
  const torrent = new Torrent({
    url: oldtorrent.url,
    magnet: '',
    title: '',
    hash: oldtorrent.hash,
    quality: oldtorrent.quality,
    size: oldtorrent.size,
    seeds: oldtorrent.seeds,
    peers: oldtorrent.peers,
    source: 'yifi',
  });
  return torrent;
};

const parseMovie = (movie, { MovieDbEn }, { MovieDbFr }, { imdbApi }) => {
  const genres = parseGenre(MovieDbEn.genre_ids, MovieDbFr.genre_ids);
  for (let i = 0; i < movie.torrents.length; i += 1) {
    const torrentTitle = {
      en: `${MovieDbEn.title} - ${movie.torrents[i].quality}`,
      fr: `${MovieDbFr.title} - ${movie.torrents[i].quality}`
    };
    movie.torrents[i].title = torrentTitle;
  }
  const newMovie = new Movie({
    idImdb: movie.idImdb,
    torrents: movie.torrents,
    title: { en: MovieDbEn.title, fr: MovieDbFr.title },
    overview: { en: MovieDbEn.overview, fr: MovieDbFr.overview },
    genres,
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

const FetchTheMovieDBInfo = async (idImdb, lang) => {
  return axios.get(urlMovieDb(idImdb, lang))
    .then(({ data }) => {
      if (lang === 'en') return { MovieDbEn: data.movie_results[0] };
      else if (lang === 'fr') return { MovieDbFr: data.movie_results[0] };
    })
    .catch(err => console.log('FetchTheMovieDBInfo err', err.response));
};

const FetchImdbApiInfo = async (idImdb) => {
  return axios.get(urlImdbApi(idImdb))
    .then(({ data }) => {
      return { imdbApi: data };
    })
    .catch(err => console.log('FetchImdbApiInfo err', err));
};

const fetchMovieInfo = async (torrents, idImdb) => {
  const movie = {};
  movie.torrents = torrents.map(torrent => parseTorrent(torrent));
  movie.idImdb = idImdb;
  return axios.all([
    FetchTheMovieDBInfo(movie.idImdb, 'en'),
    FetchTheMovieDBInfo(movie.idImdb, 'fr'),
    FetchImdbApiInfo(movie.idImdb),
  ])
    .then(axios.spread((MovieDbEn, MovieDbFr, ImdbApi) => {
      return parseMovie(movie, MovieDbEn, MovieDbFr, ImdbApi);
    }))
    .catch(err => console.log('fetchMovieInfo err', err));
};

export default fetchMovieInfo;
