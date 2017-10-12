import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NotFound from '../images/Image_Not_Found.jpg';
import CardOverlay from './CardOverlay.js';

const baseStyle = {
  opacity: 1,
  width: '230px',
  height: 'auto',
};

class Card extends Component {

  constructor(props) {
    super(props);
    const { movie } = props;
    this.state = {
      src: movie.thumb,
      imgStyle: baseStyle,
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
    const { movie, user } = this.props;

    return (
      <div className="card-container">
        <div
          className="img-container"
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
            transitionName="MovieListOverlay"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            { this.state.hover ? <CardOverlay movie={movie} user={user} /> : null }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }

}

export default Card;
