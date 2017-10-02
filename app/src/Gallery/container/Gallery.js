import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../../General/components/Loading';
import MovieList from '../components/MovieList.js';
import SearchBar from '../components/SearchBar.js';

const CancelToken = axios.CancelToken;

class Gallery extends Component {

  constructor(props) {
    super(props);
    const { search } = this.props.location;
    this.state = {
      search,
      message: '',
      movies: [],
      hasMoreItems: true,
      nextHref: null,
      source: CancelToken.source(),
    };
  }

  getSearchURL = () => {
    const { pathname, search } = this.props.location;
    return (pathname + search);
  }

  loadItems = () => {
    const { nextHref, source } = this.state;
    const url = nextHref || this.getSearchURL();
    axios({
      url,
      method: 'GET',
      headers: { 'x-access-token': localStorage.getItem('x-access-token') },
      cancelToken: source.token,
    })
    .then(({ data }) => {
      const movies = [...this.state.movies, ...data.movies];

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
    const newUrl = `${pathname}?${search}`;
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
      message,
    } = this.state;
    const loader = <Loading />;
    return (
      <div>
        <SearchBar onSearch={this.search} />
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadItems}
          hasMore={hasMoreItems}
          loader={loader}
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
