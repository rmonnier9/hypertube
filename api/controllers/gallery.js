import queryString from 'query-string';

import Movie from '../models/Movie';

const getSortObj = (sort) => {
  let sortObj;
  switch (sort) {
    default:
      sortObj = { idImdb: 1 };
  }
  return sortObj;
};

export const getSuggestion = async (req, res) => {
  const { query } = req;

  // initialize the suggestion object
  const matchObj = {};

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
  console.log(movies.length);

  // format server response
  const resObj = { error: '', movies };
  if (movies.length === numberPerRequest) {
    query.start = toSkip + numberPerRequest;
    resObj.nextHref = `/api/gallery/suggestion/?${queryString.stringify(query)}`;
  }

  // send response and end request
  return res.send(resObj);
};

export const getSearch = (req, res) => {

  return res.send({ error: '' });
}
