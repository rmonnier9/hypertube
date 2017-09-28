import axios from 'axios';
import _ from 'lodash';
import fetchMovieInfos from './fetchMovieInfos';

const urlYify = 'https://yts.ag/api/v2/list_movies.json';
const urlEztv = 'https://eztv.ag/api/get-torrents'


const fetchMovieInfosFromArray = (movies) => {
  console.log(movies);
  fetchMovieInfos(movies[0]);
  // movies.forEach((movie) => {
  //   fetchMovieInfos(movie);
  // })
}

const movieScraperYify = async () => {
  const { data: { data } } = await axios.get(urlYify);
  const { movie_count: movieCount } = data;

  const limit = 50;
  const max = Math.ceil(movieCount / limit);
  for (let page = 1; page <= 1; page += 1) {
    const url = `${urlYify}?limit=${limit}&page=${page}`;
    axios.get(url).then(({ data: { data: { movies } } }) => {
      fetchMovieInfosFromArray(movies);
    });
  }
}

const movieScraper = async () => {
  await movieScraperYify();
  // await movieScraperEztv();
}

export default movieScraper;
