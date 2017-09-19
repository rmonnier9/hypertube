import { combineReducers } from 'redux';
import i18nReducer from './i18n';

import auth from './authReducer';

const rootReducer = combineReducers({
  auth,
  i18n: i18nReducer,
});

export default rootReducer;
