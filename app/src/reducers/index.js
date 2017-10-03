import { combineReducers } from 'redux';
import i18n from './i18n';

import auth from './authReducer';

const rootReducer = combineReducers({
  auth,
  i18n,
});

export default rootReducer;
