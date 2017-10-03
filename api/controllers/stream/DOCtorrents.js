import fs from 'fs';
import events from 'events';
// import colors  from 'colors';
// import promise from 'promise';
// import mongoose from 'mongoose';
// import changeCase from 'change-case';
import torrentStream from 'torrent-stream';

import Movie from '../models/Movie';
import mimeTypes from './mimeTypes';

// var settings = require('./config.json');

const handler = new events.EventEmitter();
const spiderStreamer = require('./streamer');

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

const getMovieStream = (magnet, torrentPath, movie, resolution) => (
  new Promise(((fulfill, reject) => {
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
        const movie_data = {
          name: movieFile.name,
          length: movieFile.length,
          date: movie.released,
          // stream: movieFile.createReadStream({ flags: "r", start: 0, end: movieFile.length - 1 })
          path: `${engine.path}/${movieFile.path}`
        };
        console.log('spiderTorrent Notice: Movie data obtained:', movie_data);
        fulfill(movie_data);
        /* Save hash to database */
        resolution.data = {
          name: movieFile.name,
          length: movieFile.length,
          path: `${engine.path}/${movieFile.path}`,
          torrent_date: new Date()
        };
        movie.save().then(
          /* Promise fulfill callback */
          (ret_movie) => {
            console.log('Mongoose Notice:', 'Title updated:'.cyan, ret_movie.title);
            return fulfill(true);
          },
          /* Promise reject callback */
          (err) => {
            console.error('Mongoose Error:'.red, `${movie.title}:`, clean_mongoose_err(err));
            return fulfill(false);
          }
        );
        /* Set up engine logger */
        if (original) {
          movieFile.createReadStream({ start: movieFile.length - 1025, end: movieFile.length - 1 });
          engine.on('download', (piece_index) => {
            // if (piece_index % 10 == 0) {
            console.log('torrentStream Notice: Engine', engine.hashIndex, 'downloaded piece: Index:', piece_index, '(', engine.swarm.downloaded, '/', movieFile.length, ')');
            // }
          });
          engine.on('idle', () => {
            console.log('torrentStream Notice: Engine', engine.hashIndex, 'idle');
            if (engine.selection.length === 0) { // (engine.swarm.downloaded < movie_data.length) {
              // console.log('torrentStream Notice: Engine', engine.hashIndex, 'downloaded (', engine.swarm.downloaded, '/', movie_data.length, ')');
              console.log('torrentStream Notice: Engine', engine.hashIndex, 'no files selected');
            } // else {
            console.log('torrentStream Notice: Engine', engine.hashIndex, 'downloaded (', engine.swarm.downloaded, '/', movie_data.length, '); destroying');
            /* FIXME: If fds are still open, maybe turn this back on */
            engine.removeAllListeners();
            engine.destroy();
            console.log('torrentStream Notice: Movie set as downloaded:', movie.title, resolution.resolution);
            resolution.data.downloaded = true;
            movie.save().then(
              /* Promise fulfill callback */
              (ret_movie) => {
                console.log('Mongoose Notice:', 'Title updated:'.cyan, ret_movie.title);
                return fulfill(true);
              },
              /* Promise reject callback */
              (err) => {
                console.error('Mongoose Error:'.red, `${movie.title}:`, clean_mongoose_err(err));
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
  }))
);
// console.log('Torrent Stream Error:'.red, err.message);

/* Helper to output prettier Mongoose error */
const clean_mongoose_err = (err) => {
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
  console.log('spiderTorrent Notice: Query:', req.query);
  console.log('spiderTorrent Notice: Headers:', req.headers);
  let torrentId;
  let resolution;
  const range = req.headers.range;
  try {
    /* Get movie._id and resolution in req.params */
    if (req.params.id) torrentId = decodeURIComponent(req.params.id);
    // if (req.query.resolution) resolution = decodeURIComponent(req.query.resolution);
  } catch (exception) {
    /* On exception, redirect */
    console.log('spiderTorrent Error:'.red, 'Could not decode params:', req.params);
    handler.emit('badRequest', res);
    return false;
  }
  if (torrentId) {
    /* Query for movie */
    const movie = Movie.findOne({ 'torrents.hash': torrentId })
    console.log('spiderTorrent Notice: Found title:', movie.title);
    /* Get resolution info from movie */
    const torrent = movie.torrents.filter((torrent) => {
      if (torrent.hash === torrentId) {
        return true;
      }
      return false;
    });
    // console.log('spiderTorrent Notice: Resolution info:', resolution.data.name);
    const torrentPath = `./torrents/${torrent}`;
    if (resolution.data.path && resolution.data.length) {
      console.log('spiderTorrent Notice: Movie data found for', movie.title, resolution.resolution);
      let fileSize;
      try {
        fileSize = fs.statSync(torrentPath).size;
      } catch (exception) {
        console.log('spiderTorrent Error:'.red, 'Movie size not found');
        fileSize = 0;
      }
      // console.log('spiderTorrent Notice: Movie size comparison:', fileSize, resolution.data.length);
      if (fileSize >= resolution.data.length && (enginePaths[torrentPath] === 1 || resolution.data.downloaded)) {
        /* Does not work: file always final size; poential fix? */
        console.log('spiderTorrent Notice: Movie already torrented; streaming:', movie.title, resolution.resolution);
        spiderStreamer({
          name: resolution.data.name,
          length: resolution.data.length,
          date: movie.released,
          path: resolution.data.path
        }, req.query, range, res);
        return true;
      }
    }
    /* DONE BY TORRET-STREAM: Create folder './torrents/'+movie._id+'/'+resolution.resolution in a way that does not destroy it if it exists */
    /* Get filestream, filename and file size from torrent-stream, with the file created in folder above */
    console.log('spiderTorrent Notice: Movie not yet torrented; torrenting:', movie.title, resolution.resolution);
    const data = await getMovieStream(resolution.magnet, torrentPath, movie, resolution)
    /* Hand filestream, filename and file size to vid-streamer hack */
    // console.log('spiderTorrent Notice: Sending data spiderStreamer: { name: "'+data.name+'", size: '+data.length+', date: [Date], stream: [Stream] }');
    spiderStreamer(data, req.query, range, res);
  }
};

export default spiderTorrent;
