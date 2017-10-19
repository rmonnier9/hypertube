import bluebird from 'bluebird';
import torrentStream from 'torrent-stream';
import devNull from 'dev-null';
import Movie from '../../models/Movie';
import mimeTypes from './mimeTypes';
import getFileExtension from './getFileExtension';
import streamConversion from './streamConversion';
import { createSubFile } from './subtitles';

const fs = bluebird.promisifyAll(require('fs'));

const engineHash = {};

const setUpEngine = (engine, file, hash) => {
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
};

const getFileStreamTorrent = (torrentPath, hash) => new Promise((resolve, reject) => {
  let file;

  const magnet = `magnet:?xt=urn:btih:${hash}`;
  // Download has already started
  if (engineHash[hash]) {
    file = engineHash[hash];
    console.log(engineHash, file);
    resolve(file);
  }

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
    file.select();
    setUpEngine(engine, file, hash);
    engineHash[hash] = file;
    resolve(file);
  });
});

// ROUTE CONTROLLER
export const startTorrent = async (req, res) => {
  // If download had aleady started
  if (req.torrent.data && req.torrent.data.name) {
    return res.send({ err: '' });
  }

  const pathFolder = `./torrents/${req.idImdb}/${req.torrent.hash}`;
  const file = await getFileStreamTorrent(pathFolder, req.torrent.hash);
  const { frSubFilePath, enSubFilePath } = await createSubFile(req.idImdb, req.torrent.hash);
  req.torrent.data = {
    path: `${pathFolder}/${file.path}`,
    enSubFilePath,
    frSubFilePath,
    name: file.name,
    size: file.length,
    torrentDate: new Date(),
  };

  // Start sequential download for the first 50MB by piping them to /dev/null
  const stream = file.createReadStream({ start: 0, end: 50000000 });
  stream.pipe(devNull());

  // Add movie data to DB
  await Movie.updateOne({ idImdb: req.idImdb, 'torrents.hash': req.torrent.hash }, { $set: { 'torrents.$.data': req.torrent.data } });

  return res.send({ error: '' });
};

// ROUTE CONTROLLER
export const getLoadingStatus = async (req, res) => {
  if (!req.torrent.data || !req.torrent.data.name) {
    return res.send({ err: 'Download has not started.' });
  }

  try {
    const { size } = await fs.statAsync(req.torrent.data.path);
    return res.send({ progress: Math.round((size / 30000000) * 100), err: '' });
  } catch (e) {
    res.send({ err: 'File system doesnt match database.' });
  }
};

// ROUTE CONTROLLER
export const streamer = async (req, res) => {
  // If download had aleady started
  if (!req.torrent.data || !req.torrent.data.path || !engineHash[req.torrent.hash]) {
    return res.json({ err: 'Download has not been started.' });
  }
  let stream;
  if (req.torrent.data.downloaded) {
    stream = fs.createReadStream(req.torrent.data.path);
  } else {
    const pathFolder = `./torrents/${req.idImdb}/${req.torrent.hash}`;
    const file = await getFileStreamTorrent(pathFolder, req.torrent.hash);
    stream = file.createReadStream();
  }
  streamConversion(req.torrent, stream, res);
};
