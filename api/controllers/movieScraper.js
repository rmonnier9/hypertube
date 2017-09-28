import axios from 'axios';
import _ from 'lodash';
import fetchMovieInfos from './fetchMovieInfos';

const urlYify = 'https://yts.ag/api/v2/list_movies.json';
const urlEztv = 'https://eztv.ag/api/get-torrents'

async function movieScraperYify() {
  const { data: { data } } = await axios.get(urlYify);
  const { movie_count: movieCount } = data;

  const limit = 50;
  const max = Math.ceil(movieCount / limit);
  for (let page = 1; page <= 1; page += 1) {
    const url = `${urlYify}?limit=${limit}&page=${page}`;
    axios.get(url).then(({ data: { data: { movies } } }) => {
      console.log(movies[0]);
      const { torrents, imdb_code: imdbId } = movies[0];
      console.log('test2', torrents, imdbId);
      fetchMovieInfos(torrents, imdbId);
      // movies.forEach((movie) => {
      //   fetchMovieInfos(movie);
      // })
    });
  }
};

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
  await movieScraperYify();
  // await movieScraperEztv();
}

export default movieScraper;
