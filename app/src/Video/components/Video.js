import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import axios from 'axios';


class Video extends Component {

  state = { loaded: false, trackFr: null, trackEn: null };

  componentDidMount() {
    const { id, hash } = this.props.match.params;
    const { locale } = this.props.intl;
    const lang = locale === 'fr-fr' ? 'fr' : 'en';
    this.stream = `http://localhost:3000/api/movie/stream/${id}/${hash}`;
    const create = `http://localhost:3000/api/movie/create/${id}/${hash}`;
    axios.get(create)
      .then(({ data: { error } }) => {
        if (!error) {
          axios.get(`/api/movie/subtitle/${id}/${hash}`)
            .then(({ data: { frSubFilePath, enSubFilePath } }) => {
              console.log('fr', frSubFilePath);
              console.log('en', enSubFilePath);
              this.trackFr = this.makeTrack(lang, 'Français', 'fr', frSubFilePath);
              this.trackEn = this.makeTrack(lang, 'English', 'en', enSubFilePath);
              this.setState({ loaded: true });
            });
        }
      });
  }

  componentWillUnmount() {
    if (this.inter) clearInterval(this.inter);
  }

  makeTrack = (primary, label, lang, subPath) => {
    if (!subPath || subPath === 'none') {
      const newLabel = lang === 'fr' ? `${label} indisponible` : `${label} unavailable`;
      return <track kind="subtitles" label={newLabel} srcLang={lang} src={subPath} />;
    }
    if (primary === lang) return <track kind="subtitles" label={label} srcLang={lang} src={`/static/${subPath}`} default />;
    return <track kind="subtitles" label={label} srcLang={lang} src={`/static/${subPath}`} />;
  }

  render() {
    if (!this.state.loaded) return <span>Your movie should begin shortly</span>;
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
