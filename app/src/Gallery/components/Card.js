import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NotFound from '../images/Image_Not_Found.jpg';
import CardOverlay from './CardOverlay.js';
import '../css/CardOverlay.css';

const styles = {
  cardContainer: {
    margin: '10px',
    width: '250px',
    height: '400px',
    borderStyle: 'solid',
    borderWidth: '1px',
    textAlign: 'center',
    padding: '5px 10px',
    backgroundColor: 'darkgrey',
    zIndex: 1,
    color: 'white',
  },
  imgContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  imgStyle: {
    opacity: 1,
    width: '230px',
    height: 'auto',
  },
};

class Card extends Component {

  constructor(props) {
    super(props);
    this.state = {
      src: props.movie.medium_cover_image,
      imgStyle: styles.imgStyle,
      imgContainer: styles.imgContainer,
      hover: false,
      error: false,
    };
  }

  componentDidMount() {
    const img = new Image();
    img.onerror = () => {
      this.setState({ src: NotFound });
    };
    img.src = this.state.src;
  }

  mouseEnter = (e) => {
    e.preventDefault();
    const { imgStyle } = this.state;
    const newstyle = { ...imgStyle };
    newstyle.opacity = 0.4;
    this.setState({ hover: true, imgStyle: newstyle });
  }

  mouseOut = (e) => {
    e.preventDefault();
    const { imgStyle } = this.state;
    const newstyle = { ...imgStyle };
    newstyle.opacity = 1;
    this.setState({ hover: false, imgStyle: newstyle });
  }

  FirstChild = (props) => {
    const childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
  }

  render() {
    const { movie } = this.props;
    return (
      <div style={styles.cardContainer}>
        <div
          style={this.state.imgContainer}
          onMouseOver={(e) => { this.mouseEnter(e); }}
          onMouseLeave={(e) => { this.mouseOut(e); }}
        >
          <img
            src={this.state.src}
            style={this.state.imgStyle}
            alt=""
          />
          <ReactCSSTransitionGroup
            component={this.FirstChild}
            transitionName="example"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            { this.state.hover ? <CardOverlay movie={movie} /> : null }
          </ReactCSSTransitionGroup>
        </div>
        <h5>{movie.title}</h5>
        <h6>{movie.year}</h6>
      </div>
    );
  }

}

export default Card;
