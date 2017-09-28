import axios from 'axios';

const initialQueryYifi = 'https://yts.ag/api/v2/list_movies.json?sort=seeds&limit=10';
const initialTheMovieDbQuery = '';


const yifiParamsMaker = (params) => {
  const url = null;
  return url;
};

const yifiCaller = (url) => {
  return axios.get(url)
    .then(({ status, status_message, data }) => {
      if (status === 'error') {
        console.log('yifi error:', status_message);
      } else {
        const { movies } = data.data;
        return { yifiMovies: movies };
      }
    });
};

const initDb = (req, res) => {
  
};

const suggestions = (req, res) => {
  axios.all([yifiCaller(initialQueryYifi)])
    .then(axios.spread((yifiMovies) => {
      console.log('about to send', yifiMovies);
      return res.send({ error: '', movies: yifiMovies });
    }));
};

const search = (req, res) => {
  return res.send({ error: '' });
}

export { suggestions, search, initDb };
