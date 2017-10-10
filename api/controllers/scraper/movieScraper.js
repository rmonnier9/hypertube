import axios from 'axios';
import { RateLimiter } from 'limiter';
import moment from 'moment';

import { fetchMovieInfosYifi, fetchMovieInfosEztv, parseTorrentEztv } from './fetchMovieInfos';
import { Movie } from '../../models/Movie';

const urlYify = 'https://yts.ag/api/v2/list_movies.json?sort=seeds&limit=50';
const urlEztv = 'https://eztv.ag/api/get-torrents?limit=100';

const addToDb = async (movie) => {
  console.log('add', movie.imdb_code);
  const newTorrent = parseTorrentEztv(movie.torrents);
  const idImdb = movie.imdb_code;
  try {
    Movie.update(
      { idImdb },
      { $push: { torrents: { $each: newTorrent } } });
  } catch (e) {
    console.log('torrent dup');
  }
};

const cleanForYifi = async (movies) => {
  const newMovies = await Promise.all(movies.map(async (movie) => {
    const existingMovie = await Movie.findOne({ idImdb: movie.imdb_code });
    return new Promise((resolve, reject) => {
      if (!existingMovie) resolve(movie);
      else reject('doublon', movie.imdb_code);
    }).catch(err => console.log(err));
  }));
  const cleaned = newMovies.filter(Boolean);
  return cleaned;
};

const cleanForEztv = async (torrents) => {
  const relevantTorrent = torrents.map((torrent) => {
    const { imdb_id: idImdb, seeds } = torrent;
    if (idImdb !== '' && seeds >= 8) {
      return { imdb_code: `tt${idImdb}`, torrents: [torrent] };
    }
    return null;
  });
  const notCleaned = relevantTorrent.filter(Boolean);
  if (!notCleaned.length) return notCleaned;
  const consolidated = [];
  for (let i = 0; i < notCleaned.length; i += 1) {
    const index = consolidated.findIndex(x => x.imdb_code === notCleaned[i].imdb_code);
    if (index === -1) {
      consolidated.push(notCleaned[i]);
    } else {
      consolidated[index].torrents.push(notCleaned[i].torrents[0]);
    }
  }
  const newMovies = await Promise.all(consolidated.map(async (movie) => {
    const existingMovie = await Movie.findOne({ idImdb: movie.imdb_code });
    return new Promise((resolve, reject) => {
      if (!existingMovie) resolve(movie);
      else {
        addToDb(movie);
        reject('add torrent');
      }
    }).catch(err => console.log(err));
  }));
  const cleaned = newMovies.filter(Boolean);
  return cleaned;
};

async function movieScraperYify(page, max, old) {
  if (page === max) return 'ok';
  const url = `${urlYify}&page=${page}`;
  return axios.get(url)
    .then(async ({ data: { data: { movies } } }) => {
      const limiter = new RateLimiter(1, 600);
      const newMovies = await cleanForYifi(movies);
      if (!newMovies.length) return movieScraperYify(page + 1, max, old);
      const results = await Promise.all(newMovies.map(movie => (
        new Promise((resolve) => {
          limiter.removeTokens(1, () => {
            resolve(fetchMovieInfosYifi(movie));
          });
        })
      )));
      Movie.insertMany(results, { ordered: false });
      const now = moment();
      console.log('completion: ', page * 50, ' / ', max * 50);
      console.log('elapsed time: ', (now - old) / 1000 / 60, ' minutes');
      return movieScraperYify(page + 1, max, old);
    });
}

async function movieScraperEztv(page, max, old) {
  console.log('call page', page);
  if (page === max) return 'ok';
  const url = `${urlEztv}&page=${page}`;
  return axios.get(url)
    .then(async ({ data: { torrents } }) => {
      const newMovies = await cleanForEztv(torrents);
      if (!newMovies.length) return movieScraperEztv(page + 1, max, old);
      console.log(`search for ${newMovies.length} movies`);
      const limiter = new RateLimiter(1, 50);
      const results = await Promise.all(newMovies.map(movie => (
        new Promise((resolve) => {
          limiter.removeTokens(1, () => {
            resolve(fetchMovieInfosEztv(movie));
          });
        })
      )));
      Movie.insertMany(results, { ordered: false });
      const now = moment();
      console.log('completion: ', page * 50, ' / ', max * 50);
      console.log('elapsed time: ', (now - old) / 1000 / 60, ' minutes');
      return movieScraperEztv(page + 1, max, old);
    });
}

const ScraperYifiInit = async () => {
  const { data: { data } } = await axios.get(urlYify);
  const { movie_count: movieCount } = data;
  const max = Math.ceil(movieCount / 50);
  const now = moment();
  const results = await movieScraperYify(1, max, now);
  console.log('end', results);
};

const ScraperEztvInit = async () => {
  // try {
  //   await Movie.deleteMany({ 'torrents.source': 'eztv' });
  // } catch (e) {
  //   console.log('delete error', e);
  // }
  const { data } = await axios.get(`${urlEztv}&page=1`);
  console.log('dat', data);
  const { torrents_count: torrentsCount } = data;
  const max = Math.ceil(torrentsCount / 100);
  const now = moment();
  const eztvResults = await movieScraperEztv(1, max, now);
  console.log('end', eztvResults);
};


async function movieScraper() {
  // ScraperYifiInit();
  ScraperEztvInit();
}

export default movieScraper;
