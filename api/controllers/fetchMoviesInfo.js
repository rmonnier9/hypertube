import axios from 'axios';

const keyMovieDb = '92d923e066d13a3034abbbfb0d5ea7ab';

const urlMovieDb = (imdbId, lang) => (
  `https://api.themoviedb.org/3/find/${imdbId}?api_key=${keyMovieDb}&language=${lang}&external_source=imdb_id`
);

const urlImdbApi = imdbId => (
  `http://www.theimdbapi.org/api/movie?movie_id=${imdbId}`
);


const parse = (movie, MovieDbEn, MovieDbFr, ImdbApi) => {
  movie.title[0] = MovieDbEn.title;
  movie.title[1] = MovieDbFr.title;
  movie.overview[0] = MovieDbEn.overview;
  movie.overview[1] = MovieDbFr.overview;
  movie.genre[0] = MovieDbEn.genres;
  movie.genre[1] = MovieDbFr.genres;
  movie.runtime = ImdbApi.length;
  movie.director = ImdbApi.director;
  movie.stars = ImdbApi.stars;
  movie.rating = parseFloat(ImdbApi.rating);
  movie.posterLarge = ImdbApi.poster_large;
  movie.thumb = ImdbApi.thumb;
  movie.year = parseInt(ImdbApi.year, 10);
};

const FetchTheMovieDBInfo = (imdbId, lang) => {
  return axios.get(urlMovieDb(imdbId, lang))
    .then(({ movie_results }) => {
      if (lang === 'eng') return { MovieDbEn: movie_results };
      else if (lang === 'fr') return { MovieDbFr: movie_results };
    })
    .catch(err => console.log('FetchTheMovieDBInfo err', err));
};

const FetchImdbApiInfo = (imdbId) => {
  return axios.get(urlImdbApi(imdbId))
    .then(data => ({ imdbApi: data }))
    .catch(err => console.log('FetchImdbApiInfo err', err));
};

const FetchMovieInfo = (movie) => {
  axios.all([
    FetchTheMovieDBInfo(movie.imdbId, 'fr'),
    FetchTheMovieDBInfo(movie.imdbId, 'en'),
    FetchImdbApiInfo(movie.imdbId)])
    .then(axios.spread((MovieDbEn, MovieDbFr, ImdbApi) => {
      parse(movie, MovieDbEn, MovieDbFr, ImdbApi);
      console.log(movie);
    }))
    .catch();
};

export default FetchMovieInfo;
