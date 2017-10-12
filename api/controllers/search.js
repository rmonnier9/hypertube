import queryString from 'query-string';

import Movie from '../models/Movie';

const getSortObj = (sort, sortBySuggestion, lang) => {
  if (sortBySuggestion) {
    return { 'torrents.seeds': -1 };
  }

  const sortObj = {};
  if (lang === 'fr') {
    sortObj['title.fr'] = 1;
  }
  sortObj['title.en'] = 1;

  switch (sort) {
    case 'latest':
      sortObj.year = -1;
      break;

    case 'oldest':
      sortObj.year = 1;
      break;

    case 'rating':
      sortObj.rating = -1;
      break;

    case 'seeds':
      sortObj['torrents.seeds'] = -1;
      break;

    default:
      break;
  }

  return sortObj;
};

/**
 * GET /api/gallery/search
 * Search movies into database.
 */

export const getSearch = async (req, res) => {
  const { query } = req;
  const { lang = 'en' } = query;
  const matchObj = { $and: [] };

  if (query.name) {
    const regex = new RegExp(query.name, 'i');
    const $or = [
      { director: regex },
      { stars: regex },
    ];
    if (lang === 'fr') {
      $or.push({ 'title.fr': regex });
    } else {
      $or.push({ 'title.en': regex });
    }
    matchObj.$and.push({ $or });
  }
  if (query.genre) {
    if (lang === 'fr') {
      matchObj.$and.push({
        'genres.fr': query.genre,
      });
    } else {
      matchObj.$and.push({
        'genres.en': query.genre,
      });
    }
  }
  if (query.rating) {
    matchObj.$and.push({
      rating: { $gte: query.rating }
    });
  }

  const sortBySuggestion = !!matchObj.$and.length;
  const sortObj = getSortObj(query.sort, sortBySuggestion, lang);

  // define number of results per requests
  const toSkip = !query.start ? 0 : parseInt(query.start, 10);
  const numberPerRequest = 10;

  // get users from db
  const cursor = Movie.find(
    matchObj,
    null,
    {
      sort: sortObj,
      skip: toSkip,
      limit: numberPerRequest,
    }
  );

  const movies = await cursor.exec();

  // format server response
  const resObj = { error: '', movies };
  if (movies.length === numberPerRequest) {
    query.start = toSkip + numberPerRequest;
    resObj.nextHref = `/api/gallery/search?${queryString.stringify(query)}`;
  }

  // send response and end request
  return res.send(resObj);
};

export default getSearch;
