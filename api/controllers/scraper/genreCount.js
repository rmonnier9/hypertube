import Movie from '../../models/Movie';
import Genre from '../../models/Genre';

const changes = [
  { en: 'Drama', fr: 'Drame' },
];

// you can pass change to make to the db

const UpdateTradGenre = async ({ en, fr }) => {
  return Movie.updateMany(
    { 'genres.fr': en },
    { $set: { 'genres.$.fr': fr } },
  );
};

const showGenreTableTrad = async () => {
  const resultEn = await Movie.aggregate(
    { $unwind: '$genres' },
    { $group: { _id: '$genres.en', sum: { $sum: 1 } } },
    { $sort: { sum: 1 } },
  );
  const resultFr = await Movie.aggregate(
    { $unwind: '$genres' },
    { $group: { _id: '$genres.fr', sum: { $sum: 1 } } },
    { $sort: { sum: 1 } },
  );
};

const sortAndCreateGenreTable = async () => {
  const resultEn = await Movie.aggregate(
    { $unwind: '$genres' },
    { $group: { _id: '$genres.en', sum: { $sum: 1 } } },
    { $sort: { sum: 1 } },
  );
  const resultFr = await Movie.aggregate(
    { $unwind: '$genres' },
    { $group: { _id: '$genres.fr', sum: { $sum: 1 } } },
    { $sort: { sum: 1 } },
  );
  const final = [];
  for (let i = 0; i < resultEn.length; i += 1) {
    final[i] = { en: resultEn[i]._id, fr: resultFr[i]._id, sum: resultEn[i].sum };
  }
  const genres = final.map(genre => (
    new Genre({
      count: genre.sum,
      en: genre.en,
      fr: genre.fr,
    })
  ));
  const end = await Genre.insertMany(genres);
  console.log(end);
};

export const operateOnGenreTable = async (req, res) => {
  // const finish = await Promise.all(changes.map(change => UpdateTradGenre(change)));
  // console.log('end', finish);
  // getGenreTable();
  // sortAndCreateGenreTable();
  // showGenreTableTrad();

  return res.send({ error: '' });
};

export const getGenreTable = async (req, res) => {
  const genres = await Genre.find({});
  return res.send({ error: '', genres });
};
