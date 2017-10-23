const axios = require('axios');
const { RateLimiter } = require('limiter');
const mongoose = require('mongoose');
const dotenv = require('dotenv/config');
const { Movie } = require('../../models/MovieTest');
const { fetchMovieInfosEztv, parseTorrentEztv } = require('./fetchMovieInfos');

const urlEztv = 'https://eztv.ag/api/get-torrents?limit=100';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

function getEztvData(page) {
  const url = `${urlEztv}&page=${page}`;
  return axios.get(url, { timeout: 1000 }).catch((err) => {
    if (err.message === 'timeout of 1000ms exceeded' || err.response.status === 522) {
      console.log(`EZTV response timed out for page ${page}, retrying...`);
      return getEztvData(page);
    }
    console.log(err.message);
    process.exit(1);
  });
}

function getRelevantTorrents(torrents) {
  const relevantTorrents = [];
  torrents.forEach((torrent) => {
    const { imdb_id: idImdb, seeds } = torrent;
    if (idImdb !== '' && seeds >= 8) {
      relevantTorrents.push({ imdb_code: `tt${idImdb}`, torrents: [torrent] });
    }
  });
  return relevantTorrents;
}

function mergeResultsForOneMovie(results) {
  const consolidated = [];
  results.forEach((result) => {
    const index = consolidated.findIndex(item => item.imdb_code === result.imdb_code);
    if (index === -1) consolidated.push(result);
    else {
      consolidated[index].torrents.push(result.torrents[0]);
    }
  });
  return consolidated;
}

function cleanEztvResult(torrents) {
  const relevantTorrents = getRelevantTorrents(torrents);
  return mergeResultsForOneMovie(relevantTorrents);
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
  const newTorrents = parseTorrentEztv(nonExistingTorrents);
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
  const newMovie = await fetchMovieInfosEztv(movie);
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
  const limiter = new RateLimiter(1, 100);
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
  console.log(`loading EZTV page ${page}`);
  try {
    const { data: { torrents } } = await getEztvData(page);
    const cleanedResults = cleanEztvResult(torrents);
    await Promise.all(handleResults(cleanedResults));
    return movieScraperRecursive(page + 1, nbPage);
  } catch (e) {
    throw new Error(`An error occured for page ${page}: ${e.message}`);
  }
}

async function getNbPageEZTV() {
  const { data: { torrents_count: torrentsCount } } = await getEztvData(1);
  console.log('count: ', torrentsCount);
  return Math.ceil(torrentsCount / 100);
}

async function movieScraperEZTV() {
  console.log('Starting scraping...');
  const nbPage = await getNbPageEZTV();
  console.log('nbPage: ', nbPage);
  return movieScraperRecursive(1, nbPage);
}

movieScraperEZTV().then(() => {
  console.log('SUCCESS');
  process.exit(0);
}).catch((err) => {
  console.log(err);
  process.exit(1);
});

// const url = `${urlEztv}&page=1`;
// axios.get(url).then(res => console.log(res.data));
