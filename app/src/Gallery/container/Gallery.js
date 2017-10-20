import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';
import MovieList from '../components/MovieList.js';
import SearchBar from '../components/SearchBar.js';
import Filter from './Filter.js';
import '../css/gallery.css';

const CancelToken = axios.CancelToken;

class Gallery extends Component {

  constructor(props) {
    super(props);
    const parsed = queryString.parse(this.props.location.search);
    this.lang = props.locale.split('-')[0];
    this.mounted = true;
    this.state = {
      genre: parsed.genre || '',
      rating: parsed.rating || 0,
      sort: parsed.sort || '',
      name: parsed.name || '',
      movies: [],
      error: [],
      hasMoreItems: true,
      nextHref: null,
      source: CancelToken.source(),
      loaded: false,
    };
  }

  componentDidMount() {
    const url = '/api/me';
    axios({ url, method: 'GET' })
    .then(({ data: { error, user } }) => {
      if (error.length) {
        this.setState({ error });
      } else {
        this.user = user;
        this.setState({ loaded: true });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { source } = this.state;
    source.cancel('Request canceled by reloading.');
    const parsed = queryString.parse(nextProps.location.search);
    this.setState({
      ...parsed,
      movies: [],
      loadStarted: true,
      hasMoreItems: true,
      nextHref: null,
      source: CancelToken.source(),
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getSearchURL = () => {
    const { search } = this.props.location;
    return (`/api/gallery/search${search}`);
  }

  loadItems = () => {
    const { nextHref, source } = this.state;
    const url = nextHref || this.getSearchURL();
    axios({ url, method: 'GET', cancelToken: source.token })
    .then(({ data }) => {
      const movies = [...this.state.movies, ...data.movies];
      if (!this.mounted) return;
      if (data.nextHref) {
        this.setState({
          movies,
          nextHref: data.nextHref,
        });
      } else {
        this.setState({
          movies,
          hasMoreItems: false,
          nextHref: null,
        });
      }
    })
    .catch((error) => {
      if (axios.isCancel(error)) {
        // console.log('Request canceled', error.message);
      } else {
        // console.log(error);
      }
    });
  }

  changeUrl = (name, genre, rating, sort) => {
    const { pathname } = this.props.location;
    const newUrl = `${pathname}?name=${name}&genre=${genre}&rating=${rating}&sort=${sort}&lang=${this.lang}`;
    this.props.history.push(newUrl);
  }

  search = (name) => {
    const {
      source,
      genre,
      rating,
      sort,
    } = this.state;
    source.cancel('Request canceled by reloading.');
    this.changeUrl(name, genre, rating, sort);
    this.setState({
      name,
      movies: [],
      loadStarted: true,
      hasMoreItems: true,
      nextHref: null,
      source: CancelToken.source(),
    });
  }

  filter = (text, value) => {
    const {
      source,
      name,
    } = this.state;
    const genre = (text === 'genre') ? value : this.state.genre;
    const rating = (text === 'rating') ? value : this.state.rating;
    const sort = (text === 'sort') ? value : this.state.sort;
    source.cancel('Request canceled by reloading.');
    this.changeUrl(name, genre, rating, sort);
    this.setState({
      [name]: value,
      movies: [],
      loadStarted: true,
      hasMoreItems: true,
      nextHref: null,
      source: CancelToken.source(),
    });
  }

  render() {
    const {
      movies,
      hasMoreItems,
      genre,
      rating,
      sort,
    } = this.state;
    if (!this.state.loaded) return null;
    return (
      <div>
        <Filter
          onFilter={this.filter}
          location={this.props.location}
          genre={genre}
          rating={rating}
          sort={sort}
        />
        <SearchBar
          onSearch={this.search}
          location={this.props.location}
        />
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadItems}
          hasMore={hasMoreItems}
        >
          <MovieList
            movies={movies}
            hasMoreItems={hasMoreItems}
            user={this.user}
          />
        </InfiniteScroll>
      </div>
    );
  }
}

const mapStateToProps = ({ i18n: { locale } }) => ({
  locale,
});

export default connect(mapStateToProps)(Gallery);
