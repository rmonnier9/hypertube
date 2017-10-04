import queryString from 'query-string';

import Movie from '../models/Movie';

const getSortObj = (sort) => {
  let sortObj;
  switch (sort) {
    case 'latest':
      sortObj = { year: -1 };
      break;

    case 'oldest':
      sortObj = { year: 1 };
      break;

    case 'rating':
      sortObj = { rating: -1 };
      break;

    case 'seeds':
      sortObj = { 'torrents.seeds': -1 };
      break;

    default:
      sortObj = { year: -1 };
  }
  return sortObj;
};

export const getSearch = async (req, res) => {
  const { query } = req;
  let matchObj = {};

  if (query.name) {
    const regex = new RegExp(query.name, 'i');

    matchObj = {
      $or: [
        { 'title.fr': regex },
        { 'title.en': regex },
        { director: regex },
        { stars: regex },
      ],
    };
  } else if (query.genre === 'all') {
    matchObj = { rating: { $gte: query.rating } };
  } else if (query.genre) {
    matchObj = {
      $and: [
        { 'genres.en': query.genre },
        { rating: { $gte: query.rating } }
      ],
    };
  }

  // create aggregate params
  const sortObj = getSortObj(query.sort);

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
