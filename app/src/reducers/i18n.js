// Translated strings
import localeData from '../i18n/locales/data.json';

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const defaultLanguage = (
  navigator.languages && navigator.languages[0]) ||
  navigator.language || navigator.userLanguage;

const langWithoutRegionCode = language => language.toLowerCase().split(/[_-]+/)[0];

// ------------------------------------
// Constants
// ------------------------------------
export const LOCALE_CHANGE = 'LOCALE_CHANGE';

// ------------------------------------
// Actions
// ------------------------------------
export function localeChange(locale) {
  return {
    type: LOCALE_CHANGE,
    payload: locale,
  };
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export const updateLocale = ({ dispatch }) => {
  return nextLocale => dispatch(localeChange(nextLocale));
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  locale: defaultLanguage,
  messages: localeData[defaultLanguage] || localeData[langWithoutRegionCode(defaultLanguage)] || localeData['en-en'],
};

export default function i18nReducer(state = initialState, action) {
  return action.type === LOCALE_CHANGE
    ? {
      locale: action.payload,
      messages: localeData[action.payload]
      || localeData[langWithoutRegionCode(action.payload)]
      || localeData.en,
    }
    : state;
}
