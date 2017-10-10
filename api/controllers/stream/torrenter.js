import events from 'events';
import torrentStream from 'torrent-stream';
import Movie from '../../models/Movie';
import mimeTypes from './mimeTypes';
import getVideoStream from './streamer';
import getFileExtension from './getFileExtension';
import startConversion from './startConversion';

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


const deleteFolderRecursive = async (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
    return 'ok';
  }
};

const eraseForTest = async (idImdb, hash) => {
  await Movie.update({ idImdb, 'torrents.hash': hash }, { $unset: { 'torrents.$.data': '' } });
  await deleteFolderRecursive('./torrents');
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

const getFileStreamTorrent = (torrentPath, torrent) => new Promise((resolve, reject) => {
  let engine;
  let file;

  const magnet = `magnet:?xt=urn:btih:${torrent.hash}`,
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
const videoTorrenter = async (req, res, next) => {
  // If download had aleady started
  if (req.torrent.data && req.torrent.data.downloaded) {
    req.data = req.torrent.data;
    next();
  }
  console.log('spiderTorrent Notice: Movie not yet torrented; torrenting:', movie.title);

  const pathFolder = `./torrents/${req.movie.idImdb}/${req.torrent.hash}`;
  const file = await getFileStreamTorrent(pathFolder, req.torrent);
  req.torrent.data = {
    path: `${pathFolder}/${file.path}`,
    name: file.name,
    size: file.length,
    torrentDate: new Date(),
  };
  await startConversion(torrent, file.createReadStream());
  req.movie.save();
  return getVideoStream(torrent.data, req, res);
};

export default videoTorrenter;
