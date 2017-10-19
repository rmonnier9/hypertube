import axios from 'axios';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

const requestLogin = creds => ({
  type: LOGIN_REQUEST,
  isFetching: true,
  isAuthenticated: false,
  creds,
});

const receiveLogin = () => ({
  type: LOGIN_SUCCESS,
  isFetching: false,
  isAuthenticated: true,
});

const loginError = message => ({
  type: LOGIN_FAILURE,
  isFetching: false,
  isAuthenticated: false,
  message,
});

const requestLogout = () => ({
  type: LOGOUT_REQUEST,
  isFetching: true,
  isAuthenticated: true,
});

const receiveLogout = () => ({
  type: LOGOUT_SUCCESS,
  isFetching: false,
  isAuthenticated: false,
});

// login action function, calls the API to get a token
const loginUser = (creds, oauth = false) => (dispatch) => {
  dispatch(requestLogin(creds));

  let request;
  if (oauth) {
    request = axios.get(`/api/auth/${creds.provider}/callback?code=${creds.code}`);
  } else {
    request = axios.post('/api/signin', creds);
  }

  request.then(({ data: { error }, headers }) => {
    const accessToken = headers['x-access-token'];
    const langUser = headers['lang-user'];

    if (!error && accessToken && langUser) {
      axios.defaults.headers.common['x-access-token'] = accessToken;
      localStorage.setItem('x-access-token', accessToken);
      localStorage.setItem('isAuthenticated', true);
      localStorage.setItem('lang-user', langUser);
      dispatch(receiveLogin());
    } else {
      dispatch(loginError(error));
    }
  })
  .catch((err) => {});
};

// logout action function, remove local storage
const logoutUser = () => (dispatch) => {
  dispatch(requestLogout());
  localStorage.removeItem('x-access-token');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('lang-user');
  delete axios.defaults.headers.common['x-access-token'];
  dispatch(receiveLogout());
};

export {
  loginUser,
  logoutUser,
};
