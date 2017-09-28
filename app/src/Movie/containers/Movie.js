import React, { Component } from 'react';
import TorrentTable from '../components/TorrentTable';
import '../css/movie.css';

const movie = {
  idImdb: 'tt5322012', //yify
  torrents: [
    {
      "url":"https://yts.ag/torrent/download/3549148407CA28A6069380F9F91C01DD584255A7",
      "hash":"3549148407CA28A6069380F9F91C01DD584255A7",
      "quality":"720p",
      "seeds":620,
      "peers":1094,
      "size":"665.4 MB",
      "size_bytes":697722470,
    },
    {
      "url":"https://yts.ag/torrent/download/0FA39CA32B1406725191E07109309A4D9E1F801E",
      "hash":"0FA39CA32B1406725191E07109309A4D9E1F801E",
      "quality":"1080p",
      "seeds":583,
      "peers":808,
      "size":"1.38 GB",
      "size_bytes":1481763717,
      "date_uploaded":"2017-09-28 08:00:53",
      "date_uploaded_unix":1506600053}
    ], //yify
  title: ["Wish Upon", "I Wish - Faites un vœu"], //tmdb
  year: 2017, //tmdb
  overview: [
    "A teenage girl discovers a box with magical powers, but those powers comes with a deadly price.",
    "Pas facile de survivre à l'enfer du lycée, Claire Shannon et ses copines en savent quelque chose. Du coup, quand son père lui offre une ancienne boîte à musique dont les inscriptions promettent d'exaucer tous ses vœux, Claire tente sa chance. Et ça marche ! Argent, popularité, petit ami, tout semble parfait. Mais le rêve a un prix : au fur et à mesure de ses souhaits, des personnes de son entourage meurent dans des conditions particulièrement atroces. Claire le sait : elle doit se débarrasser de la boîte pour sauver sa vie et celle de ses proches avant de faire le voeu de trop."
  ], //tmdb
  genres: [
    ["Fantasy", "Horror", "Thriller"],
    ["Fantastique", "Horreur", "Thriller"]
  ], //tmdb
  length: 90, //tmdb
  director: "John R. Leonetti",
  cast: ["Joey King", "Ryan Phillippe", "Ki Hong Lee"],
  rating: 4.7,
  posterLarge: "https://images-na.ssl-images-amazon.com/images/M/MV5BOGQxN2NlMWItNzMyOC00ODYxLThkNDktMWQ0ZjA2MjQyYjIwXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg",
  thumb: "https://images-na.ssl-images-amazon.com/images/M/MV5BOGQxN2NlMWItNzMyOC00ODYxLThkNDktMWQ0ZjA2MjQyYjIwXkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_UX182_CR0,0,182,268_AL_.jpg",
}

const timing = (length) => {
  const hours = Math.trunc(length / 60);
  const minutes = length % 60;
  return ({ hours, minutes });
};

class Movie extends Component {

  state = {

  }

  componentDidMount() {
    // const url = '/api/movie';
    // axios({ url, method: 'GET' })
    // .then(({ data: { error, movie } }) => {
    //   if (error) {
    //     this.setState({ error });
    //   } else {
    //     this.user = user;
    //     this.setState({
    //       movie,
    //     });
    //   }
    // });
  }

  render() {
    const genres = movie.genres[0].map((genre, index, array) => {
      if (index === array.length - 1) {
        return (<span>{genre}</span>);
      }
      return (<span>{genre}, </span>);
    });
    const actors = movie.cast.map((actor, index, array) => {
      if (index === array.length - 1) {
        return (<span>{actor}</span>);
      }
      return (<span>{actor}, </span>);
    });
    const timeObj = timing(movie.length);
    const time = `${timeObj.hours}h${timeObj.minutes}`;

    return (
      <div className="movie-container">
        <img className="movie-poster" src={movie.posterLarge} alt="" />
        <div>
          <h1>{ movie.title[0] }</h1>
          <div>
            <span>{ movie.year } </span>
            <span>{ time } </span>
            <span>IMDB: { movie.rating }/10</span>
          </div>
          <div>
            Overview: { movie.overview[0] }
          </div>
          <div className="movie-details">
            <div>
              With: { actors }
            </div>
            <div>
              Director: { movie.director }
            </div>
            <div>
              Genres: { genres }
            </div>
          </div>
          <TorrentTable movie={movie} />
        </div>
      </div>
    );
  }

}

export default Movie;
