import React, { Component } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '../../General/components/Loading';
import MovieList from '../components/MovieList.js';
import SearchBar from '../components/SearchBar.js';
import Filter from './Filter.js';
import '../css/gallery.css';

// const CancelToken = axios.CancelToken;

class Gallery extends Component {

  constructor(props) {
    super(props);
    const { search } = this.props.location;
    this.state = {
      search,
      movies: [],
      hasMoreItems: true,
      nextHref: null,
    };
  }

  getSearchURL = () => {
    const { search } = this.props.location;
    return (`/api/gallery/search${search}`);
  }

  loadItems = () => {
    const { nextHref } = this.state;
    const url = nextHref || this.getSearchURL();
    axios({ url, method: 'GET' })
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
      console.log(error);
    });
  }

  search = (search) => {
    const { pathname } = this.props.location;
    const newUrl = `${pathname}?name=${search}`;
    this.props.history.push(newUrl);
    this.setState({
      search,
      movies: [],
      loadStarted: true,
      hasMoreItems: true,
      nextHref: null,
    });
  }

  filter = (search) => {
    const { pathname } = this.props.location;
    const { genre, rating, orderBy } = search;
    const newUrl = `${pathname}?genre=${genre}&rating=${rating}&order=${orderBy}`;
    this.props.history.push(newUrl);
    this.setState({
      search,
      loadStarted: true,
      hasMoreItems: true,
      nextHref: null,
    });
  }

  render() {
    const {
      movies,
      hasMoreItems,
    } = this.state;
    // console.log(movies);
    const loader = <Loading />;
    return (
      <div>
        <Filter
          onFilter={this.filter}
        />
        <SearchBar
          onSearch={this.search}
          location={this.props.location}
        />
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
