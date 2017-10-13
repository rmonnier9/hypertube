import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import { IntlProvider, addLocaleData } from 'react-intl';

import rootReducer from './reducers';
import HyperRouter from './HyperRouter.js';
// import registerServiceWorker from './registerServiceWorker';


// ========================================================
// Internationalization
// ========================================================
addLocaleData([...en, ...fr]);
const mapStateToProps = state => ({ locale: state.i18n.locale, messages: state.i18n.messages });
const ConnectedIntlProvider = connect(mapStateToProps)(IntlProvider);

const token = localStorage.getItem('x-access-token');
if (token) {
  axios.defaults.headers.common['x-access-token'] = token;
}

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware, // neat middleware that logs actions
  ),
);


ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <ConnectedIntlProvider>
        <HyperRouter />
      </ConnectedIntlProvider>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root'),
);
// registerServiceWorker();
