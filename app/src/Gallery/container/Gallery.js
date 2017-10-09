import React, { Component } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
// import Loading from '../../General/components/Loading';
import MovieList from '../components/MovieList.js';
import SearchBar from '../components/SearchBar.js';
import Filter from './Filter.js';
import '../css/gallery.css';

const CancelToken = axios.CancelToken;
const lang = 'fr';

class Gallery extends Component {

  constructor(props) {
    super(props);
    const { search } = this.props.location;
    this.mounted = true;
    this.state = {
      search,
      movies: [],
      hasMoreItems: true,
      nextHref: null,
      source: CancelToken.source(),
    };
  }

  componentWillReceiveProps = (nextProps) => {
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

  shouldComponentUpdate(nextProps, nextState) {
    const { search } = nextState;
    if (search || (!search && this.state.search)) return true;
    const { nextHref } = nextState;
    const { nextHref: oldHref } = this.state;
    const nextstart = !nextHref ? 0 : nextHref.split('=').pop();
    const oldstart = !oldHref ? 0 : oldHref.split('=').pop();
    if (nextstart <= oldstart) return false;
    return true;
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
        console.log('Request canceled', error.message);
      } else {
        console.log(error);
      }
    });
  }

  search = (search) => {
    const {
      source,
    } = this.state;
    source.cancel('Request canceled by reloading.');
    const { pathname } = this.props.location;
    const newUrl = `${pathname}?name=${search}&sort=name-${lang}`;
    this.props.history.push(newUrl);
    this.setState({
      search,
      movies: [],
      loadStarted: true,
      hasMoreItems: true,
      nextHref: null,
      source: CancelToken.source(),
    });
  }

  filter = (search) => {
    const {
      source,
    } = this.state;
    source.cancel('Request canceled by reloading.');
    const { pathname } = this.props.location;
    const { genre, rating, sort } = search;
    const newUrl = `${pathname}?genre=${genre}&rating=${rating}&sort=${sort}`;
    this.props.history.push(newUrl);
    this.setState({
      search,
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
    } = this.state;
    // const loader = <Loading />;
    if (!this.mounted) return null;
    return (
      <div>
        <Filter
          onFilter={this.filter}
          location={this.props.location}
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
          />
        </InfiniteScroll>
      </div>
    );
  }

}

export default Gallery;
