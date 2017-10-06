import fs from 'fs';
import events from 'events';
import torrentStream from 'torrent-stream';
import Movie from '../../models/Movie';
import mimeTypes from './mimeTypes';
import spiderStreamer from './spiderStreamer';

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

const hasValidExtension = (filename) => {
  const extension = filename.match(/.*(\..+?)$/);
  if (extension !== null && extension.length === 2
    && mimeTypes[extension[1].toLowerCase()] !== undefined) {
    return true;
  }
  return false;
};

const engineHash = {};

const setUpEngine = (engine, movieFile, movie, torrent) => {
  movieFile.createReadStream({ start: movieFile.length - 1025, end: movieFile.length - 1 });
  engine.on('download', (pieceIndex) => {
    // if (pieceIndex % 10 == 0) {
    console.log('torrentStream Notice: Engine', engine.hashIndex, 'downloaded piece: Index:', pieceIndex, '(', engine.swarm.downloaded, '/', movieFile.length, ')');
    // }
  });
  engine.on('idle', () => {
    console.log('torrentStream Notice: Engine', engine.hashIndex, 'idle');
    if (engine.selection.length === 0) { // (engine.swarm.downloaded < movieData.length) {
      // console.log('torrentStream Notice:
      // Engine', engine.hashIndex, 'downloaded (',
      // engine.swarm.downloaded, '/', movieData.length, ')');
      console.log('torrentStream Notice: Engine', engine.hashIndex, 'no files selected');
    } // else {
    console.log('torrentStream Notice: Engine', engine.hashIndex, 'downloaded (',
      engine.swarm.downloaded, '/', movieFile.length, '); destroying');
    /* FIXME: If fds are still open, maybe turn this back on */
    engine.removeAllListeners();
    engine.destroy();
    console.log('torrentStream Notice: Movie set as downloaded:', movie.title);
    torrent.data.downloaded = true;
    movie.save();
    // }
  });
};

const getEngineAndFile = (magnet, torrentPath, movie, torrent) => new Promise((resolve, reject) => {
  let engine;
  let file;
  if (engineHash[torrentPath]) {
    engine = engineHash[torrentPath].engine;
    file = engineHash[torrentPath].file;
    return resolve({ engine, file });
  }
  engine = torrentStream(magnet, { path: torrentPath });
  engine.on('ready', () => {
    engine.files.forEach((current) => {
      /* Look for valid movie file extension and biggest file */

      if (!hasValidExtension(current.name)) {
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
  });
  setUpEngine(engine, file, movie, torrent);
  engineHash[torrentPath] = { engine, file };
  return resolve({ engine, file });
});

const getMovieStream = async (magnet, torrentPath, movie, torrent) => {
  /* FIXME: Only do this engine if it hasn't been done already;
  add 'data' field in database to make this work. */
  const { engine, file } = await getEngineAndFile(magnet, torrentPath, movie, torrent);

  /* If movie found */
  /* Torrent movie */
  file.select();
  /* Create movie file data hash and send it back */
  const movieData = {
    name: file.name,
    length: file.length,
    date: movie.released,
    // stream: movieFile.createReadStream({ flags: "r", start: 0, end: movieFile.length - 1 })
    path: `${engine.path}/${file.path}`
  };
  console.log('spiderTorrent Notice: Movie data obtained:', movieData);
  torrent.data = {
    name: file.name,
    length: file.length,
    path: `${engine.path}/${file.path}`,
    torrentDate: new Date(),
  };
  movie.save();
  return movieData;
};

/* Helper to output prettier Mongoose error */
const cleanMongooseErr = (err) => {
  // var str = err.name+': '+err.message;
  let str = err.message;
  if (err.errors) {
    str += ':';
    for (error in err.errors) {
      str += ` ${err.errors[error].message}`;
    }
  }
  return str;
};

/* Called by video player */
const spiderTorrent = async (req, res) => {
  // console.log('spiderTorrent Notice: Request:', req);
  console.log('spiderTorrent Notice: Query:', req.params);
  console.log('spiderTorrent Notice: Headers:', req.headers);
  let idImdb;
  let hash;
  let torrent;
  const { range } = req.headers.range;
  /* If missing (or someone tried to hack resolution) redirect */
  if (!idImdb || !hash) {
    console.log('spiderTorrent Error:'.red, 'Invalid request:', req.params);
    return handler.emit('badRequest', res);
  }
  /* Query for movie */
  const movie = Movie.findOne({ idImdb, 'torrents.hash': hash });
  if (!movie) {
    return handler.emit('noMovie', res);
  }
  movie.torrents.forEach((currentTorrent) => {
    if (currentTorrent.hash === hash) {
      torrent = currentTorrent;
    }
  });
  console.log('spiderTorrent Notice: Found title and hash:', movie.title);
  const torrentPath = `./torrents/${movie.idImdb}/${hash}`;

  // If download had aleady started
  if (torrent.data.path && torrent.data.length) {
    console.log('spiderTorrent Notice: Movie data found for', movie.title, torrent.hash);
    let fileSize;
    try {
      fileSize = fs.statSync(torrent.data.path).size;
    } catch (exception) {
      console.log('spiderTorrent Error:'.red, 'Movie size not found');
      fileSize = 0;
    }
    // console.log('spiderTorrent Notice: Movie size comparison:', fileSize, torrent.data.length);
    if (fileSize >= torrent.data.length || torrent.data.downloaded) {
      /* Does not work: file always final size; poential fix? */
      console.log('spiderTorrent Notice: Movie already torrented; streaming:', movie.title, torrent.hash);
      return spiderStreamer({
        name: torrent.data.name,
        length: torrent.data.length,
        date: movie.released,
        path: torrent.data.path
      }, req.params, range, res);
    }
  }
  /* DONE BY TORRET-STREAM: Create folder './torrents/'+movie._id+'/'+resolution.resolution
  in a way that does not destroy it if it exists */
  /* Get filestream, filename and file size from torrent-stream,
  with the file created in folder above */
  console.log('spiderTorrent Notice: Movie not yet torrented; torrenting:', movie.title);
  const data = await getMovieStream(`magnet:?xt=urn:btih:${hash}`, torrentPath, movie, torrent);
  // Hand filestream, filename and file size to vid-streamer hack
  // console.log('spiderTorrent Notice: Sending data spiderStreamer: { name: "'+data.name+'", size: '+data.length+', date: [Date], stream: [Stream] }');
  return spiderStreamer(data, req.params, range, res);
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
