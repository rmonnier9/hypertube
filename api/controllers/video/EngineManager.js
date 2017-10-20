import torrentStream from 'torrent-stream';
import Movie from '../../models/Movie';
import mimeTypes from './mimeTypes';
import getFileExtension from './getFileExtension';

class Engine {
  constructor(hash) {
    this.hash = hash;
  }

  getMagnet() {
    return `magnet:?xt=urn:btih:${this.hash}`;
  }
}

export default class EngineManager {
  constructor() {
    this.engineHash = {};
  }

  setUpEngine(hash) {
    const { engine, file } = this.engineHash[hash];

    engine.on('download', (pieceIndex) => {
      if (pieceIndex % 10 === 0) {
        const completion = Math.round((100 * engine.swarm.downloaded) / file.length);
        console.log('Completion ', completion, ' %');
        console.log('torrentStream Notice: Engine', engine.infoHash, 'downloaded piece: Index:', pieceIndex, '(', engine.swarm.downloaded, '/', file.length, ')');
      }
    });

    engine.on('idle', () => {
      console.log('torrentStream Notice: Engine', engine.infoHash, 'downloaded (', engine.swarm.downloaded, '/', file.length, ').');
      Movie.updateOne({ 'torrents.hash': hash }, { $set: { 'torrents.$.data.downloaded': true } });
    });
  }

  getMagnet(hash) {
    return `magnet:?xt=urn:btih:${hash}`;
  }

  getFile(hash) {
    if (!this.engineHash[hash]) return null;

    return this.engineHash[hash].file;
  }

  getEngin(hash) {
    if (!this.engineHash[hash]) return null;

    return this.engineHash[hash].engine;
  }

  getFileStreamTorrent(torrentPath, hash) {
    return new Promise((resolve, reject) => {
      const magnet = this.getMagnet(hash);

      // Download has already started
      if (this.engineHash[hash]) {
        const { file } = this.engineHash[hash];
        resolve(file);
      }

      let file;
      const engine = torrentStream(magnet, { path: torrentPath });
      engine.on('ready', () => {
        engine.files.forEach((current) => {
        // Look for valid movie file extension and select the biggest file
          const fileExtension = getFileExtension(current.name);
          if (!mimeTypes[fileExtension]) {
          // Ignore non-movie files
          } else if (file && current.length < file.length) {
          // Already a bigger movie file
          } else {
            file = current;
          }
        });
        if (!file) {
          engine.removeAllListeners();
          engine.destroy();
          reject(new Error('no valid movie file found.'));
        }
        this.engineHash[hash] = { engine, file };
        file.select();
        this.setUpEngine(hash);
        resolve(file);
      });
    });
  }
}
