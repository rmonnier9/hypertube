import axios from 'axios';
import parseGenre from './genre';

const keyMovieDb = '92d923e066d13a3034abbbfb0d5ea7ab';

const urlMovieDb = (imdbId, lang) => (
  `https://api.themoviedb.org/3/find/${imdbId}?api_key=${keyMovieDb}&language=${lang}&external_source=imdb_id`
);

const urlImdbApi = imdbId => (
  `http://www.theimdbapi.org/api/movie?movie_id=${imdbId}`
);


const parse = async (movie, { MovieDbEn }, { MovieDbFr }, { imdbApi }) => {
  // console.log('parse', movie);
  // console.log('eng', MovieDbEn);
  // console.log('fr', MovieDbFr);
  // console.log('api', imdbApi);
  const genresEn = parseGenre(MovieDbEn.genre_ids, 'en');
  const genresFr = parseGenre(MovieDbFr.genre_ids, 'fr');
  movie.title = [];
  movie.title.push(MovieDbEn.title);
  movie.title.push(MovieDbFr.title);
  movie.overview = [];
  movie.overview.push(MovieDbEn.overview);
  movie.overview.push(MovieDbFr.overview);
  movie.genre = [];
  movie.genre.push(genresEn);
  movie.genre.push(genresFr);
  movie.runtime = parseInt(imdbApi.length, 10);
  movie.director = imdbApi.director;
  movie.stars = imdbApi.stars;
  movie.rating = parseFloat(imdbApi.rating);
  movie.posterLarge = imdbApi.poster.large;
  movie.thumb = imdbApi.poster.thumb;
  movie.year = parseInt(imdbApi.year, 10);
  return movie;
};

const FetchTheMovieDBInfo = (imdbId, lang) => {
  return axios.get(urlMovieDb(imdbId, lang))
    .then(({ data }) => {
      if (lang === 'en') return { MovieDbEn: data.movie_results[0] };
      else if (lang === 'fr') return { MovieDbFr: data.movie_results[0] };
    })
    .catch(err => console.log('FetchTheMovieDBInfo err', err.response.data));
};

const FetchImdbApiInfo = (imdbId) => {
  return axios.get(urlImdbApi(imdbId))
    .then(({ data }) => {
      return { imdbApi: data };
    })
    .catch(err => console.log('FetchImdbApiInfo err', err));
};

const fetchMovieInfo = (torrents, imdbId) => {
  const movie = {
    torrents,
    imdbId,
  };
  return axios.all([
    FetchTheMovieDBInfo(movie.imdbId, 'en'),
    FetchTheMovieDBInfo(movie.imdbId, 'fr'),
    FetchImdbApiInfo(movie.imdbId),
  ])
    .then(axios.spread((MovieDbEn, MovieDbFr, ImdbApi) => {
      return parse(movie, MovieDbEn, MovieDbFr, ImdbApi);
    }))
    .catch(err => console.log('fetchMovieInfo err', err));
};

export default fetchMovieInfo;
