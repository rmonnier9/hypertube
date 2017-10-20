import axios from 'axios';
import { RateLimiter } from 'limiter';
import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import Movie from '../../models/MovieTest';
import { fetchMovieInfoYifi, parseTorrentYifi } from './fetchMovieInfos';

const urlYify = 'https://yts.ag/api/v2/list_movies.json?sort=seeds&limit=50';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

function getYifyData(page) {
  const url = `${urlYify}&page=${page}`;
  return axios.get(url);
}

function torrentIsNew(torrents, newTorrent) {
  for (let i = 0; i < torrents.length; i++) {
    if (torrents[i].hash === newTorrent.hash) return false;
  }
  return true;
}

function addTorrentsToExistingMovie(movie, torrents) {
  const nonExistingTorrents = [];
  torrents.forEach((torrent) => {
    if (torrentIsNew(movie.torrents, torrent)) {
      nonExistingTorrents.push(torrent);
    }
  });
  if (!nonExistingTorrents.length) {
    console.log('No new torrents');
    return Promise.resolve();
  }
  const newTorrents = parseTorrentYifi(nonExistingTorrents, {
    en: movie.title.en,
    fr: movie.title.fr,
  });
  newTorrents.forEach((newTorrent) => {
    movie.torrents.push(newTorrent);
  });
  return new Promise((resolve, reject) => {
    movie.save((err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

async function addNewMovie(movie) {
  const newMovie = await fetchMovieInfoYifi(movie);
  if (newMovie) {
    console.log('Add new movie', movie.imdb_code);
    return new Promise((resolve, reject) => {
      newMovie.save((err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
  console.log('adding new movie aborted');
}

function addNewMovieWithLimiter(limiter, movie) {
  return new Promise((resolve) => {
    limiter.removeTokens(1, () => resolve(addNewMovie(movie)));
  });
}

function handleResults(results) {
  const limiter = new RateLimiter(1, 600);
  return results.map(async (result) => {
    const existingMovie = await Movie.findOne({ idImdb: result.imdb_code });
    if (existingMovie) {
      console.log('add torrents to existing movie', result.imdb_code);
      return addTorrentsToExistingMovie(existingMovie, result.torrents);
    }
    return addNewMovieWithLimiter(limiter, result);
  });
}

async function movieScraperRecursive(page, nbPage) {
  if (page > nbPage) return true;
  console.log(`loading YIFY page ${page}`);
  try {
    const { data: { data: { movies } } } = await getYifyData(page);
    await Promise.all(handleResults(movies));
    return movieScraperRecursive(page + 1, nbPage);
  } catch (e) {
    throw new Error(`An error occured for page ${page}: ${e.message}`);
  }
}

async function getNbPageYIFY() {
  const { data: { data: { movie_count: movieCount } } } = await getYifyData(1);
  console.log('count: ', movieCount);
  return Math.ceil(movieCount / 50);
}

async function movieScraperYIFY() {
  console.log('Starting scraping...');
  const nbPage = await getNbPageYIFY();
  console.log('nbPage: ', nbPage);
  return movieScraperRecursive(1, nbPage);
}

movieScraperYIFY().then(() => {
  console.log('SUCCESS');
  process.exit(0);
}).catch((err) => {
  console.log(err);
  process.exit(1);
});
