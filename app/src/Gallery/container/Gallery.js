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
    // const { search } = props.location;
    const parsed = queryString.parse(this.props.location.search);
    this.lang = props.locale.split('-')[0];
    this.mounted = true;
    this.state = {
      // search,
      genre: parsed.genre || 'all',
      rating: parsed.rating || 0,
      sort: parsed.sort || '',
      text: parsed.name || '',
      movies: [],
      error: [],
      hasMoreItems: true,
      nextHref: null,
      source: CancelToken.source(),
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
        // this.setState({ ...parsed });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { search } = nextProps.location;
    this.setState({
      search,
      movies: [],
      loadStarted: true,
      hasMoreItems: true,
      nextHref: null,
      source: CancelToken.source(),
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const { search } = nextState;
  //   if (search || (!search && this.state.search)) return true;
  //   const { nextHref } = nextState;
  //   const { nextHref: oldHref } = this.state;
  //   const nextstart = !nextHref ? 0 : nextHref.split('=').pop();
  //   const oldstart = !oldHref ? 0 : oldHref.split('=').pop();
  //   if (nextstart <= oldstart) return false;
  //   return true;
  // }

  componentWillUnmount() {
    this.mounted = false;
  }

  // saveState = (name, value) => {
    // console.log(name, value);
    // this.setState({ [name]: value }, this.filter());
    // this.filter();
  // }

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

  search = (text) => {
    const {
      source,
      genre,
      rating,
      sort,
    } = this.state;
    source.cancel('Request canceled by reloading.');
    const { pathname } = this.props.location;

    const newUrl = `${pathname}?name=${text}&genre=${genre}&rating=${rating}&sort=${sort}&lang=${this.lang}`;
    this.props.history.push(newUrl);
    this.setState({
      text,
      movies: [],
      loadStarted: true,
      hasMoreItems: true,
      nextHref: null,
      source: CancelToken.source(),
    });
  }

  filter = (name, value) => {
    const {
      source,
      text,
    } = this.state;
    const genre = (name === 'genre') ? value : this.state.genre;
    const rating = (name === 'rating') ? value : this.state.rating;
    const sort = (name === 'sort') ? value : this.state.sort;
    source.cancel('Request canceled by reloading.');
    const { pathname } = this.props.location;
    // const { genre, rating, sort } = search;
    const newUrl = `${pathname}?name=${text}&genre=${genre}&rating=${rating}&sort=${sort}&lang=${this.lang}`;
    this.props.history.push(newUrl);
    this.setState({
      // search,
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
    if (!this.mounted) return null;
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
