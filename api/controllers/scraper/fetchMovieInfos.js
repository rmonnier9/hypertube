import axios from 'axios';
import ptn from 'parse-torrent-name';
import parseGenre from './genre';
import { Movie, Torrent } from '../../models/Movie';

const keyMovieDb = '92d923e066d13a3034abbbfb0d5ea7ab';

const urlMovieDb = (idImdb, lang) => (
  `https://api.themoviedb.org/3/find/${idImdb}?api_key=${keyMovieDb}&language=${lang}&external_source=imdb_id`
);

const urlImdbApi = idImdb => (
  `http://www.theimdbapi.org/api/movie?movie_id=${idImdb}`
);


const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${Math.round(bytes / (1024 ** i), 2)} ${sizes[i]}`;
};

const parseTorrentYifi = (torrents, title) => (
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

const parseMovieYifi = (idImdb, torrents, movieDb, imdbApi) => {
  const title = { en: movieDb.en.title || '', fr: movieDb.fr.title || '' };
  const overview = { en: movieDb.en.overview || 'Unavailable', fr: movieDb.fr.overview || 'Non disponible' };
  const genres = parseGenre(movieDb.en.genre_ids, movieDb.fr.genre_ids);
  const newMovie = new Movie({
    idImdb,
    title,
    genres,
    overview,
    torrents: parseTorrentYifi(torrents, title),
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

export const parseTorrentEztv = torrents => (
  torrents.map((torrent) => {
    const info = ptn(torrent.title);
    return new Torrent({
      hash: torrent.hash,
      url: torrent.torrent_url,
      magnet: torrent.magnet_url,
      title: {
        en: torrent.title,
        fr: torrent.title,
      },
      episode: torrent.episode,
      season: torrent.season,
      quality: info.resolution,
      size: bytesToSize(torrent.size_bytes),
      seeds: torrent.seeds,
      peers: torrent.peers,
      source: 'eztv',
    });
  })
);


const parseMovieEztv = (idImdb, torrents, imdbApi) => {
  const { description, title: oldtitle, genre } = imdbApi;
  const overview = { en: description, fr: description };
  const newTitle = { en: oldtitle, fr: oldtitle };
  const genres = genre.map(el => ({ en: el, fr: el }));
  const newTorrents = parseTorrentEztv(torrents);
  const newMovie = new Movie({
    idImdb,
    title: newTitle,
    genres,
    overview,
    torrents: newTorrents,
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
  axios.get(urlMovieDb(idImdb, lang))
    .then(({ data }) => (
      data.movie_results[0]
    ))
    .catch(err => console.error('FetchTheMovieDBInfo err', err.response));
};

const FetchImdbApiInfo = async idImdb => (
  axios.get(urlImdbApi(idImdb))
    .then(({ data }) => (data))
    .catch(err => console.error('FetchImdbApiInfo err', err))
);

export const fetchMovieInfoYifi = async ({ torrents, imdb_code: idImdb }) => (
  axios.all([
    FetchTheMovieDBInfo(idImdb, 'en'),
    FetchTheMovieDBInfo(idImdb, 'fr'),
    FetchImdbApiInfo(idImdb),
  ])
    .then(axios.spread((movieDbEn, movieDbFr, imdbApi) => (
      parseMovieYifi(idImdb, torrents, { en: movieDbEn, fr: movieDbFr }, imdbApi)
    )))
    .catch(err => console.error('fetchMovieInfo err', err))
);

export const fetchMovieInfosEztv = async ({ torrents, imdb_code: idImdb }) => (
  FetchImdbApiInfo(idImdb)
    .then(imdbApi => (
      parseMovieEztv(idImdb, torrents, imdbApi)
    ))
    .catch(err => console.error('fetchMovieInfo err', err))
);
