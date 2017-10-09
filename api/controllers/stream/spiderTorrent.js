import bluebird from 'bluebird';
import events from 'events';
import torrentStream from 'torrent-stream';
import Movie from '../../models/Movie';
import mimeTypes from './mimeTypes';
import spiderStreamer from './spiderStreamer';
import getFileExtension from './getFileExtension';
import startConversion from './startConversion';

const fs = bluebird.promisifyAll(require('fs'));

const handler = new events.EventEmitter();
const settings = {
  mode: 'development',
  forceDownload: false,
  rootFolder: 'torrents/',
  rootPath: 'videos/',
  server: 'Hypertube/1.0.0',
  maxAge: '3600',
  throttle: false
};

const engineHash = {};

const setUpEngine = (engine, file, torrent) => {
  engine.on('download', (pieceIndex) => {
    // if (pieceIndex % 10 == 0) {
    console.log('torrentStream Notice: Engine', engine.infoHash, 'downloaded piece: Index:', pieceIndex, '(', engine.swarm.downloaded, '/', file.length, ')');
    // }
  });
  engine.on('idle', () => {
    console.log('torrentStream Notice: Engine', engine.infoHash, 'idle');
    console.log('torrentStream Notice: Engine', engine.infoHash, 'downloaded (',
      engine.swarm.downloaded, '/', file.length, '); destroying');
    engine.removeAllListeners();
    engine.destroy();
    console.log('torrentStream Notice: Torrent set as downloaded:', torrent.hash);
    torrent.data.downloaded = true;
  });
};

const getFileStreamTorrent = (magnet, torrentPath, torrent) => new Promise((resolve, reject) => {
  let engine;
  let file;

  // DOWNLOAD HAD ALREADY STARTED
  if (engineHash[torrentPath]) {
    engine = engineHash[torrentPath].engine;
    file = engineHash[torrentPath].file;
    resolve(file);
  }

  // DOWNLOAD HAD NOT ALREADY STARTED
  engine = torrentStream(magnet, { path: torrentPath });
  engine.on('ready', () => {
    engine.files.forEach((current) => {
      // Look for valid movie file extension and select the biggest file
      const fileExtension = getFileExtension(current.name);
      if (!mimeTypes[fileExtension]) {
        // Ignore non-movie files
        console.log('Skipping item: non-movie file', current.name, '| size:', current.length);
      } else if (file && current.length < file.length) {
        // Already a bigger movie file
        console.log('Skipping item: not the biggest file', current.name, '| size:', current.length);
      } else {
        console.log('Movie file found:', current.name, '| size:', current.length);
        file = current;
      }
    });
    if (!file) {
      engine.removeAllListeners();
      engine.destroy();
      reject(new Error('no valid movie file found.'));
    }
    file.select();
    setUpEngine(engine, file, torrent);
    engineHash[torrentPath] = { engine, file };
    resolve(file);
  });
});

// ROUTE CONTROLLER
const spiderTorrent = async (req, res) => {
  // console.log('spiderTorrent Notice: Request:', req);
  console.log('spiderTorrent Notice: Query:', req.params);
  console.log('spiderTorrent Notice: Headers:', req.headers);

  // INPUT CHECK
  const { idImdb, hash } = req.params;
  let torrent;
  if (!idImdb || !hash) {
    console.log('spiderTorrent Error:'.red, 'Invalid request:', req.params);
    return handler.emit('badRequest', res);
  }
  const movie = await Movie.findOne({ idImdb, 'torrents.hash': hash });
  if (!movie) {
    return handler.emit('noMovie', res);
  }
  // SELECT CORRESPONDING TORRENT
  movie.torrents.forEach((currentTorrent) => {
    if (currentTorrent.hash === hash) {
      torrent = currentTorrent;
    }
  });
  console.log('spiderTorrent Notice: Found title and hash:', movie.title);

  // If download had aleady started
  if (!torrent.data || !torrent.data.downloaded) {
    console.log('spiderTorrent Notice: Movie not yet torrented; torrenting:', movie.title);

    const path = `./torrents/${idImdb}/${hash}`;
    const file = await getFileStreamTorrent(`magnet:?xt=urn:btih:${hash}`, path, torrent);
    torrent.data = {
      path,
      name: file.name,
      size: file.length,
      torrentDate: new Date(),
    };
    await startConversion(torrent, file.createReadStream());
    movie.save();
  }
  return spiderStreamer(torrent.data, req, res);
};

const errorHeader = (res, code) => {
  const header = {
    'Content-Type': 'text/html',
    Server: settings.server
  };

  res.writeHead(code, header);
};

handler.on('noMovie', (res) => {
  console.log('nomovie');
  errorHeader(res, 404);
  res.end('<!DOCTYPE html><html lang="en">' +
  '<head><title>404 Not found</title></head>' +
  '<body>' +
  '<h1>Sorry...</h1>' +
  "<p>I can't play that movie.</p>" +
  '</body></html>');
});

handler.on('badRequest', (res) => {
  console.log('bad request');
  errorHeader(res, 400);
  res.end('<!DOCTYPE html><html lang="en">' +
  '<head><title>400 Bad request</title></head>' +
  '<body>' +
  '<h1>Sorry...</h1>' +
  "<p>Request is missing parameters, can't find movie.</p>" +
  '</body></html>');
});

export default spiderTorrent;
