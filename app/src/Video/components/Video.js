import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import axios from 'axios';


class Video extends Component {

  state = { loaded: false, trackFr: null, trackEn: null };

  componentDidMount() {
    const { id, hash } = this.props.match.params;
    const { locale } = this.props.intl;
    const lang = locale === 'fr-fr' ? 'fr' : 'en';
    this.url = `http://localhost:3000/api/movie/stream/${id}/${hash}`;

    // need to wait for the sub file to be created before requesting it
    setTimeout(() => {
      axios.get(`/api/movie/subtitle/${id}/${hash}`)
        .then(({ data: { error, frSubFilePath, enSubFilePath } }) => {
          const trackFr = this.makeTrack(lang, 'Français', 'fr', frSubFilePath);
          const trackEn = this.makeTrack(lang, 'English', 'en', enSubFilePath);
          this.setState({ trackEn, trackFr });
        });
    }, 6000);
    this.setState({ loaded: true });
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
    if (!this.state.loaded) return null;
    return (
      <video autoPlay id="videoPlayer" controls>
        <source src={this.url} type="video/mp4" />
        { this.state.trackEn }
        { this.state.trackFr }
      </video>
    );
  }
}

export default injectIntl(Video);
