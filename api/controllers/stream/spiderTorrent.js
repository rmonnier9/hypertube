import events from 'events';
import torrentStream from 'torrent-stream';
import Movie from '../../models/Movie';
import mimeTypes from './mimeTypes';

const handler = new events.EventEmitter();
const spiderStreamer = require('./spiderStreamer');

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

let engineCount = 0;
const engineHash = {};
const enginePaths = {};

const getMovieStream = (magnet, torrentPath, movie, torrent) => {
  return new Promise(((fulfill, reject) => {
    /* FIXME: Only do this engine bullshit if it hasn't been done already; add 'data' field in database to make this work. */
    let original = true;
    let engine = torrentStream(magnet, {
      path: torrentPath
    });
    enginePaths[torrentPath] = enginePaths[torrentPath] ? enginePaths[torrentPath] : 1;
    engineHash[(engine.hashIndex = engineCount++)] = engine;
    console.log('spiderTorrent Notice: Waiting for torrentStream engine');
    engine.on('ready', () => {
      /* Check if original engine */
      for (let i = 0; i < engine.hashIndex; i++) {
        if (engineHash[i] && engineHash[i].path === engine.path) {
          console.log('spiderTorrent Notice: Engine', engine.hashIndex, 'not original: copying engine', i);
          engineHash[engine.hashIndex] = undefined;
          engine.destroy();
          engine = engineHash[i];
          original = false;
          break;
        }
      }
      /* Actual Engine Manipulation */
      let movieFile;
      engine.files.forEach((file) => {
        /* Look for valid movie file extension and biggest file */
        if (hasValidExtension(file.name) && (!movieFile || file.length > movieFile.length)) {
          console.log('Movie file found:', file.name, '| size:', file.length);
          if (movieFile) {
            console.log('Skipping item:', movieFile.name, '| size:', movieFile.length);
            // movieFile.deselect();
          }
          movieFile = file;
        } else {
          /* Ignore non-movie files */
          console.log('Skipping item:', file.name, '| size:', file.length);
          // file.deselect();
        }
      });
      /* If movie found */
      if (movieFile) {
        /* Torrent movie */
        movieFile.select();
        /* Create movie file data hash and send it back */
        const movieData = {
          name: movieFile.name,
          length: movieFile.length,
          date: movie.released,
          // stream: movieFile.createReadStream({ flags: "r", start: 0, end: movieFile.length - 1 })
          path: `${engine.path}/${movieFile.path}`
        };
        console.log('spiderTorrent Notice: Movie data obtained:', movieData);
        fulfill(movieData);
        /* Save hash to database */
        torrent.data = {
          name: movieFile.name,
          length: movieFile.length,
          path: `${engine.path}/${movieFile.path}`,
          torrentDate: new Date()
        };
        movie.save().then(
          /* Promise fulfill callback */
          (retMovie) => {
            console.log('Mongoose Notice:', 'Title updated:'.cyan, retMovie.title);
            return fulfill(true);
          },
          /* Promise reject callback */
          (err) => {
            console.error('Mongoose Error:'.red, `${movie.title}:`, cleanMongooseErr(err));
            return fulfill(false);
          }
        );
        /* Set up engine logger */
        if (original) {
          movieFile.createReadStream({ start: movieFile.length - 1025, end: movieFile.length - 1 });
          engine.on('download', (pieceIndex) => {
            // if (pieceIndex % 10 == 0) {
            console.log('torrentStream Notice: Engine', engine.hashIndex, 'downloaded piece: Index:', pieceIndex, '(', engine.swarm.downloaded, '/', movieFile.length, ')');
            // }
          });
          engine.on('idle', () => {
            console.log('torrentStream Notice: Engine', engine.hashIndex, 'idle');
            if (engine.selection.length === 0) { // (engine.swarm.downloaded < movieData.length) {
              // console.log('torrentStream Notice: Engine', engine.hashIndex, 'downloaded (', engine.swarm.downloaded, '/', movieData.length, ')');
              console.log('torrentStream Notice: Engine', engine.hashIndex, 'no files selected');
            } // else {
            console.log('torrentStream Notice: Engine', engine.hashIndex, 'downloaded (', engine.swarm.downloaded, '/', movieData.length, '); destroying');
            /* FIXME: If fds are still open, maybe turn this back on */
            engine.removeAllListeners();
            engine.destroy();
            console.log('torrentStream Notice: Movie set as downloaded:', movie.title);
            torrent.data.downloaded = true;
            movie.save().then(
              /* Promise fulfill callback */
              (retMovie) => {
                console.log('Mongoose Notice:', 'Title updated:'.cyan, retMovie.title);
                return fulfill(true);
              },
              /* Promise reject callback */
              (err) => {
                console.error('Mongoose Error:'.red, `${movie.title}:`, cleanMongooseErr(err));
                return fulfill(false);
              }
            );
            // }
          });
        }
      } else {
        engine.removeAllListeners();
        engine.destroy();
        return reject({
          message: 'No valid movie file was found'
        });
      }
    });
  }));
};
// console.log('Torrent Stream Error:'.red, err.message);

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
const spiderTorrent = (req, res) => {
  // console.log('spiderTorrent Notice: Request:', req);
  console.log('spiderTorrent Notice: Query:', req.params);
  console.log('spiderTorrent Notice: Headers:', req.headers);
  let idImdb;
  let hash;
  let torrent;
  const range = req.headers.range;
  try {
    /* Get movie._id and resolution in req.params */
    console.log(req.params);
    if (req.params.id) idImdb = decodeURIComponent(req.params.id);
    if (req.params.hash) hash = decodeURIComponent(req.params.hash);
  } catch (exception) {
    /* On exception, redirect */
    console.log('spiderTorrent Error:'.red, 'Could not decode params:', req.params);
    handler.emit('badRequest', res);
    return false;
  }
  if (idImdb && hash) {
    /* Query for movie */
    Movie.findOne({ idImdb }, (err, movie) => {
      if (err || movie == null) {
        /* If none match, redirect */
        console.log('Mongoose Error:'.red, err);
        handler.emit('noMovie', res, err);
        return false;
      }
      console.log('spiderTorrent Notice: Found title:', movie.title);
      /* Get resolution info from movie */
      let found = false;
      movie.torrents.forEach((currentTorrent) => {
        if (currentTorrent.hash == hash) {
          found = true;
          torrent = currentTorrent;
        }
      });
      if (!found) {
        handler.emit('noMovie', res, err);
        return false;
      }
      console.log('spiderTorrent Notice: hash info:', hash);
      const torrentPath = `./torrents/${movie.idImdb}/${hash}`;
      // if (resolution.data.path && resolution.data.length) {
      //   console.log('spiderTorrent Notice: Movie data found for', movie.title, resolution.resolution);
      //   let file_size;
      //   try {
      //     file_size = fs.statSync(resolution.data.path).size;
      //   } catch (exception) {
      //     console.log('spiderTorrent Error:'.red, 'Movie size not found');
      //     file_size = 0;
      //   }
      //   // console.log('spiderTorrent Notice: Movie size comparison:', file_size, resolution.data.length);
      //   if (file_size >= resolution.data.length && (enginePaths[torrentPath] === 1 || resolution.data.downloaded)) {
      //     /* Does not work: file always final size; poential fix? */
      //     console.log('spiderTorrent Notice: Movie already torrented; streaming:', movie.title, resolution.resolution);
      //     spiderStreamer({
      //       name: resolution.data.name,
      //       length: resolution.data.length,
      //       date: movie.released,
      //       path: resolution.data.path
      //     }, req.params, range, res);
      //     return true;
      //   }
      // }
      /* DONE BY TORRET-STREAM: Create folder './torrents/'+movie._id+'/'+resolution.resolution in a way that does not destroy it if it exists */
      /* Get filestream, filename and file size from torrent-stream, with the file created in folder above */
      console.log('spiderTorrent Notice: Movie not yet torrented; torrenting:', movie.title);
      getMovieStream(`magnet:?xt=urn:btih:${hash}`, torrentPath, movie, torrent).then(
        /* Promise fulfill callback */
        (data) => {
          /* Hand filestream, filename and file size to vid-streamer hack */
          // console.log('spiderTorrent Notice: Sending data spiderStreamer: { name: "'+data.name+'", size: '+data.length+', date: [Date], stream: [Stream] }');
          spiderStreamer(data, req.params, range, res);
        },
        /* Promise reject callback */
        (err) => {
          console.log('spiderTorrent Error:'.red, err.message);
          handler.emit('noMovie', res);
          return false;
        }
      );
    });
  } else {
    /* If missing (or someone tried to hack resolution) redirect */
    console.log('spiderTorrent Error:'.red, 'Invalid request:', req.params);
    handler.emit('badRequest', res);
    return false;
  }
  return true;
};

const errorHeader = function (res, code) {
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

module.exports = spiderTorrent;
