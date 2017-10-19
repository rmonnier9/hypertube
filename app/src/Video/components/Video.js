
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import axios from 'axios';


class Video extends Component {

  state = {
    loaded: false,
    created: false,
    trackFr: null,
    trackEn: null,
    progress: 0,
  };

  componentDidMount() {
    const { id, hash } = this.props.match.params;
    const { locale } = this.props.intl;
    const lang = locale === 'fr-fr' ? 'fr' : 'en';
    this.stream = `http://localhost:3000/api/movie/stream/${id}/${hash}`;
    const startTorrent = `http://localhost:3000/api/movie/startTorrent/${id}/${hash}`;
    const getStatus = `http://localhost:3000/api/movie/getStatus/${id}/${hash}`;
    axios.get(startTorrent)
    .then(({ data: { err } }) => {
      if (!err) {
        axios.get(`/api/movie/subtitle/${id}/${hash}`)
        .then(({ data: { frSubFilePath, enSubFilePath } }) => {
          this.trackFr = this.makeTrack(lang, 'Français', 'fr', frSubFilePath);
          this.trackEn = this.makeTrack(lang, 'English', 'en', enSubFilePath);
          this.setState({ created: true });
        });
      }
    });
    this.inter = setInterval(() => {
      if (this.state.created) {
        axios.get(getStatus)
          .then(({ data: { progress, err } }) => {
            if (err) { console.log(err); }
            else if (progress >= 1) {
              clearInterval(this.inter);
              this.setState({ loaded: true });
            }
            this.setState({ progress });
          });
      }
    }, 5000);
  }

  componentWillUnmount() {
    if (this.inter) clearInterval(this.inter);
  }

  makeTrack = (primary, label, lang, subPath) => {
    if (!subPath) {
      const newLabel = lang === 'fr' ? `${label} indisponible` : `${label} unavailable`;
      return <track kind="subtitles" label={newLabel} srcLang={lang} src={subPath} />;
    }
    if (primary === lang) return <track kind="subtitles" label={label} srcLang={lang} src={subPath} default />;
    return <track kind="subtitles" label={label} srcLang={lang} src={subPath} />;
  }

  render() {
    const { progress } = this.state;
    if (!this.state.loaded) return <span>Current progress: {progress * 100} %</span>;
    return (
      <video id="videoPlayer" autoPlay controls>
        <source src={this.stream} type="video/mp4" />
        { this.trackEn }
        { this.trackFr }
      </video>
    );
  }
}

export default injectIntl(Video);
