import axios from 'axios';

const keyMovieDb = '92d923e066d13a3034abbbfb0d5ea7ab';

const urlMovieDb = (imdbId, lang) => (
  `https://api.themoviedb.org/3/find/${imdbId}?api_key=${keyMovieDb}&language=${lang}&external_source=imdb_id`
);

const urlImdbApi = imdbId => (
  `http://www.theimdbapi.org/api/movie?movie_id=${imdbId}`
);


const parse = (movie, { MovieDbEn }, { MovieDbFr }, { imdbApi }) => {
  console.log('parse movie', movie);
  console.log('parse MovieDbEn', MovieDbEn);
  console.log('parse MovieDbFr', MovieDbFr);
  console.log('parse imdbApi', imdbApi);
  movie.title = [];
  movie.title.push(MovieDbEn.title);
  movie.title.push(MovieDbFr.title);
  movie.overview = [];
  movie.overview.push(MovieDbEn.overview);
  movie.overview.push(MovieDbFr.overview);
  movie.genre = [];
  movie.genre.push(MovieDbEn.genres);
  movie.genre.push(MovieDbFr.genres);
  movie.runtime = imdbApi.length;
  movie.director = imdbApi.director;
  movie.stars = imdbApi.stars;
  movie.rating = parseFloat(imdbApi.rating);
  movie.posterLarge = imdbApi.poster.large;
  movie.thumb = imdbApi.poster.thumb;
  movie.year = parseInt(imdbApi.year, 10);
};

const FetchTheMovieDBInfo = (imdbId, lang) => {
  return axios.get(urlMovieDb(imdbId, lang))
    .then(({ data }) => {
      console.log('movie db', data);
      if (lang === 'en') return { MovieDbEn: data.movie_results[0] };
      else if (lang === 'fr') return { MovieDbFr: data.movie_results[0] };
    })
    .catch(err => console.log('FetchTheMovieDBInfo err', err));
};

const FetchImdbApiInfo = (imdbId) => {

  return axios.get(urlImdbApi(imdbId))
    .then(({ data }) => {
      console.log('fetchaMovieInfos', data);
      return { imdbApi: data };
    })
    .catch(err => console.log('FetchImdbApiInfo err', err));
};

const fetchMovieInfo = (torrents, imdbId) => {
  const movie = {
    torrents,
    imdbId,
  };
  console.log('url', urlImdbApi(imdbId));
  console.log('start', movie);
  axios.all([
    FetchTheMovieDBInfo(movie.imdbId, 'en'),
    FetchTheMovieDBInfo(movie.imdbId, 'fr'),
    FetchImdbApiInfo(movie.imdbId),
  ])
    .then(axios.spread((MovieDbEn, MovieDbFr, ImdbApi) => {
      parse(movie, MovieDbEn, MovieDbFr, ImdbApi);
      console.log('test', movie);
    }))
    .catch();
};

export default fetchMovieInfo;
