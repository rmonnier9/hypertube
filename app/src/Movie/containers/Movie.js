import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Loading from '../../General/components/Loading';
import TorrentTable from '../components/TorrentTable';
import CommentTable from '../../Comment/container/CommentTable';
import '../css/movie.css';

const timing = (length) => {
  const hours = Math.trunc(length / 60);
  const minutes = length % 60;
  return ({ hours, minutes });
};

class Movie extends Component {

  state = {
    loaded: false,
    error: null,
  }

  componentDidMount() {
    const { pathname } = this.props.location;
    const idImdb = pathname.split('/').pop();
    this.getMovie(idImdb);
  }

  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;
    const idImdb = pathname.split('/').pop();
    this.setState({ loaded: false, error: null });
    this.getMovie(idImdb);
  }


  getMovie = (idImdb) => {
    const url = `/api/movie/info/${idImdb}`;
    axios({
      url,
      method: 'GET',
    })
    .then(({ data: { error, movie } }) => {
      if (error) {
        this.setState({ error, loaded: true });
      } else {
        this.movie = movie;
        this.setState({
          loaded: true,
        });
      }
    });
  }

  render() {
    const { loaded, error } = this.state;
    const lang = this.props.locale.split('-')[0];
    const movie = this.movie;
    if (loaded === false) { return <Loading />; }
    if (error) { return <h2>{error}</h2>; }
    const genres = movie.genres.map((genre, index, array) => {
      if (index === array.length - 1) {
        return (<span key={genre[lang]}>{genre[lang]}</span>);
      }
      return (<span key={genre[lang]}>{genre[lang]}, </span>);
    });
    const actors = movie.stars.map((actor, index, array) => {
      if (index === array.length - 1) {
        return (<span key={actor}>{actor}</span>);
      }
      return (<span key={actor}>{actor}, </span>);
    });
    const timeObj = timing(movie.runtime);
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
          <CommentTable originId={movie.idImdb} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ i18n: { locale } }) => ({
  locale,
});

export default connect(mapStateToProps)(Movie);
