import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Loading from '../../General/components/Loading';
import TorrentTable from '../components/TorrentTable';
import CommentTable from '../../Comment/container/CommentTable';
import TooltipSpan from '../../General/components/TooltipSpan';
import '../css/movie.css';

const timing = (length) => {
  const hours = Math.trunc(length / 60);
  let minutes = length % 60;
  if (minutes < 10) { minutes = `0${minutes}`; }
  return ({ hours, minutes });
};

class Movie extends Component {

  state = {
    loaded: false,
    error: [{ param: '', msg: '' }],
  }

  componentDidMount() {
    const idImdb = this.props.match.params.idImdb;
    this.getMovie(idImdb);
  }

  componentWillReceiveProps(nextProps) {
    const idImdb = nextProps.match.params.idImdb;
    this.setState({ loaded: false, error: [{ param: '', msg: '' }] });
    this.getMovie(idImdb);
  }


  getMovie = (idImdb) => {
    const url = `/api/movie/info/${idImdb}`;
    axios({
      url,
      method: 'GET',
    })
    .then(({ data: { error, movie, user } }) => {
      if (error.length) {
        this.setState({ error, loaded: true });
      } else {
        this.movie = movie;
        this.user = user;
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
    const errorMessage = error[0].msg ? this.props.intl.formatMessage({ id: error[0].msg }) : '';

    if (loaded === false) { return <Loading />; }

    if (error[0].msg) { return <div className="movie-error">{errorMessage}</div>; }

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
    const time = movie.runtime !== -1 ? `${timeObj.hours}h${timeObj.minutes}` : '';
    const year = movie.year !== -1 ? movie.year : '';
    const rating = movie.rating !== -1 ? movie.rating : 0;

    const idImdb = this.movie.idImdb;
    const { movies } = this.user.profile;
    const textTooltipSeen = this.props.intl.formatMessage({ id: 'movie.tooltipSeen' });
    const tooltipSeen = (
      <TooltipSpan
        className="glyphicon glyphicon-ok movie-seen"
        id="movieSeen"
        text={textTooltipSeen}
      />
    );
    const movieSeen = movies.includes(idImdb) ? tooltipSeen : '';

    const witho = this.props.intl.formatMessage({ id: 'movie.with' });
    const director = this.props.intl.formatMessage({ id: 'movie.director' });
    const genresValue = this.props.intl.formatMessage({ id: 'movie.genres' });


    return (
      <div className="movie-container">
        <img className="movie-poster" src={movie.posterLarge} alt="movie" />
        <div className="movie-infos">
          <h1>{ movie.title[lang] } {movieSeen}</h1>
          <div>
            <span className="movie-year">{ year }</span>
            <span>{ time } </span>
          </div>
          <div>
            <span>
              <i className="glyphicon glyphicon-star" />
              <span className="movie-rating">{ rating }</span>
              <span>{'/'}10</span>
            </span>
          </div>
          <div className="movie-overview">
            { movie.overview[lang] }
          </div>
          <div className="movie-details">
            <div>
              <span className="movie-details-text">{witho}:</span>
              { actors }
            </div>
            <div>
              <span className="movie-details-text">{director}:</span>
              { movie.director }
            </div>
            <div>
              <span className="movie-details-text">{genresValue}:</span>
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

export default injectIntl(connect(mapStateToProps)(Movie));
