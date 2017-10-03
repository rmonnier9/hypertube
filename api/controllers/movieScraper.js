import axios from 'axios';
import { RateLimiter } from 'limiter';
import moment from 'moment';
import fetchMovieInfos from './fetchMovieInfos';
import Movie from '../models/Movie';

const urlYify = 'https://yts.ag/api/v2/list_movies.json?sort=seeds&limit=50';
const urlEztv = 'https://eztv.ag/api/get-torrents'

async function movieScraperYify(page, max, buffer, old) {
  if (page === max) return buffer;
  const url = `${urlYify}&page=${page}`;
  const toRemove = [];
  return axios.get(url)
    .then(async ({ data: { data: { movies } } }) => {
      const limiter = new RateLimiter(1, 600);
      const results = await Promise.all(movies.map((movie) => {
        return new Promise((resolve) => {
          limiter.removeTokens(1, () => {
            resolve(fetchMovieInfos(movie));
          });
        });
      }));
      results.forEach((result) => { buffer.push(result); });
      console.log('completion: ', page * 50, ' / ', max * 50);
      console.log('buffer is ', buffer);
      const now = moment();
      console.log('last batch took', (now - old) / 1000, ' seconds');
      return movieScraperYify(page + 1, max, buffer, now);
    });
}

//
// movies.forEach((movie) => {
//   const { torrents } = movie;
//   let { seeds } = torrents[0];
//   torrents.forEach((torrent) => {
//     if (torrent.seeds > seeds) { seeds = torrent.seeds; }
//   });
//   if (seeds < 5) {
//     toRemove.push(movie.imdb_code);
//   }
// });

// async function movieScraperEztv() {
//   const { data: { data } } = await axios.get(urlEztv);
//   const { torrents_count: torrentsCount } = data;
//
//   const limit = 50;
//   const max = Math.ceil(torrentsCount / limit);
//   for (let page = 1; page <= 1; page += 1) {
//     const url = `${urlEztv}?limit=${limit}&page=${page}`;
//     axios.get(url).then(({ data: { torrents } }) => {
//       console.log('torrents', torrents);
//       torrents.forEach((movie) => {
//         console.log('movie', movie);
//         if (movie.episode === 0) {
//           const { imdb_id: imdbId } = movie;
//           const torrents = {
//             url: movie.torrent_url,
//             magnet: movie.magnet_url,
//             peers: movie.peers,
//             seeds: movie.seeds,
//           };
//           fetchMovieInfos(torrents, imdbId);
//         }
//       });
//     });
//   }
// };


async function movieScraper() {
  const { data: { data } } = await axios.get(urlYify);
  const { movie_count: movieCount } = data;
  const max = Math.ceil(movieCount / 50);
  const buffer = [];
  console.log('Current number of movie to proccess', max * 50, ' movies');
  console.log('We currently can make 40 requests per 10 seconds on The Movie DB or 240 per minutes');
  console.log('To be sure not to pass the limit we do 33.33 requests per 10 second or 200 per minutes');
  console.log('A movie needs two requests so it makes 100 per minutes');
  console.log('So is should take', parseInt((max * 0.6 * 50) / 60, 10), 'minutes........., go relax =)');
  const now = moment();
  const results = await movieScraperYify(1, 2, buffer, now);
  console.log('end', results);
  Movie.insertMany(results)
    .then((results) => {
      console.log('db insert success of ', results.length);
    })
    .catch((err) => {
      console.log('db err', err);
    });
  // // await movieScraperEztv();
}

export default movieScraper;
