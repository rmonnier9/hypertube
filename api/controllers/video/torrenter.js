import bluebird from 'bluebird';
import devNull from 'dev-null';
import Movie from '../../models/Movie';
import streamConversion from './streamConversion';
import { createSubFile } from './subtitles';
import EngineManager from './EngineManager';

const engineManager = new EngineManager();

const fs = bluebird.promisifyAll(require('fs'));

// ROUTE CONTROLLER
export const startTorrent = async (req, res) => {
  // If download had aleady started
  if (req.torrent.data && req.torrent.data.name) {
    return res.send({ err: '' });
  }

  const pathFolder = `./torrents/${req.idImdb}/${req.torrent.hash}`;
  const file = await engineManager.getFileStreamTorrent(pathFolder, req.torrent.hash);
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
  if (!req.torrent.data || !req.torrent.data.path || !engineManager.getEngine(req.torrent.hash)) {
    return res.json({ err: 'Download has not been started.' });
  }
  let stream;
  if (req.torrent.data.downloaded) {
    stream = fs.createReadStream(req.torrent.data.path);
  } else {
    const pathFolder = `./torrents/${req.idImdb}/${req.torrent.hash}`;
    const file = await engineManager.getFileStreamTorrent(pathFolder, req.torrent.hash);
    stream = file.createReadStream();
  }
  streamConversion(req.torrent, stream, res);
};
