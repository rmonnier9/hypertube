import React, { Component } from 'react';
// import Loading from '../../General/components/Loading';
import TorrentTable from '../components/TorrentTable';
import '../css/movie.css';

const movie = {
  idImdb: 'tt5322012', //yify
  torrents: [
    {
      "url":"https://yts.ag/torrent/download/3549148407CA28A6069380F9F91C01DD584255A7",
      "magnet":"",
      "title":"",
      "hash":"3549148407CA28A6069380F9F91C01DD584255A7",
      "quality":"720p",
      "size":"665.4 MB",
      "seeds":620,
      "peers":1094,
      "source": "yifi",
    },
    {
      "url":"https://yts.ag/torrent/download/0FA39CA32B1406725191E07109309A4D9E1F801E",
      "magnet":"",
      "title":"",
      "hash":"0FA39CA32B1406725191E07109309A4D9E1F801E",
      "quality":"1080p",
      "seeds":583,
      "peers":808,
      "size":"1.38 GB",
      "source": "yifi",
    }
  ],
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

const lang = 1; // lang = 0 => english, lang = 1 = francais

const timing = (length) => {
  const hours = Math.trunc(length / 60);
  const minutes = length % 60;
  return ({ hours, minutes });
};

class Movie extends Component {

  state = {
    loaded: false,
  }

  componentDidMount() {
    // const url = '/api/movie';
    // axios({ url, method: 'GET' })
    // .then(({ data: { error, movie } }) => {
    //   if (error) {
    //     this.setState({ error });
    //   } else {
    //     this.movie = movie;
    //     this.setState({
    //       loaded: true,
    //     });
    //   }
    // });
  }

  render() {
    // const { loaded } = this.state;
    // if (loaded === false) { return <Loading />; }
    const genres = movie.genres[lang].map((genre, index, array) => {
      if (index === array.length - 1) {
        return (<span key={genre}>{genre}</span>);
      }
      return (<span key={genre}>{genre}, </span>);
    });
    const actors = movie.cast.map((actor, index, array) => {
      if (index === array.length - 1) {
        return (<span key={actor}>{actor}</span>);
      }
      return (<span key={actor}>{actor}, </span>);
    });
    const timeObj = timing(movie.length);
    const time = `${timeObj.hours}h${timeObj.minutes}`;

    return (
      <div className="movie-container">
        <img className="movie-poster" src={movie.posterLarge} alt="movie" />
        <div className="movie-infos">
          <h1>{ movie.title[lang] }</h1>
          <div>
            <span className="movie-year">{ movie.year }</span>
            <span>{ time } </span>
          </div>
          <div>
            <span>
              <i className="glyphicon glyphicon-star" />
              <span className="movie-rating">{ movie.rating }</span>
              <span>{'/'}10</span>
            </span>
          </div>
          <div className="movie-overview">
            { movie.overview[lang] }
          </div>
          <div className="movie-details">
            <div>
              <span className="movie-details-text">With:</span>
              { actors }
            </div>
            <div>
              <span className="movie-details-text">Director:</span>
              { movie.director }
            </div>
            <div>
              <span className="movie-details-text">Genres:</span>
              { genres }
            </div>
          </div>
          <TorrentTable movie={movie} lang={lang} />
        </div>
      </div>
    );
  }
}

export default Movie;
