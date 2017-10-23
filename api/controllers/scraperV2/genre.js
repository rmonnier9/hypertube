const genres = [
  { id: 28, genre: ['Action', 'Action'] },
  { id: 12, genre: ['Adventure', 'Aventure'] },
  { id: 16, genre: ['Animation', 'Animation'] },
  { id: 35, genre: ['Comedy', 'Comedie'] },
  { id: 80, genre: ['Crime', 'Crime'] },
  { id: 99, genre: ['Documentary', 'Documentaire'] },
  { id: 18, genre: ['Drama', 'Drame'] },
  { id: 10751, genre: ['Family', 'Famille'] },
  { id: 14, genre: ['Fantasy', 'Fantastique'] },
  { id: 36, genre: ['History', 'Histoire'] },
  { id: 27, genre: ['Horror', 'Horreur'] },
  { id: 10402, genre: ['Music', 'Musique'] },
  { id: 9648, genre: ['Mystery', 'Mystère'] },
  { id: 10749, genre: ['Romance', 'Romance'] },
  { id: 878, genre: ['Science Fiction', 'Science Fiction'] },
  { id: 10770, genre: ['TV Movie', 'Série Télé'] },
  { id: 53, genre: ['Thriller', 'Thriller'] },
  { id: 10752, genre: ['War', 'Guerre'] },
  { id: 37, genre: ['Western', 'Western'] },
  { id: 9999, genre: ['Undefined', 'Indefini'] },
];

const findGenre = (id, lang) => {
  const index = lang === 'fr' ? 1 : 0;
  for (let i = 0; i < genres.length; i += 1) {
    if (genres[i].id === id) return genres[i].genre[index];
  }
  return genres[genres.length].genre[index];
};

const parseGenres = (idsEn, idsFr) => {
  const result = [];
  for (let i = 0; i < idsEn.length; i += 1) {
    result[i] = { en: findGenre(idsEn[i], 'en'), fr: findGenre(idsFr[i], 'fr') };
  }
  return result;
};


module.exports = parseGenres;
