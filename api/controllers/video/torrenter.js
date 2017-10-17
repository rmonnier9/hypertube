import fs from 'fs';
import torrentStream from 'torrent-stream';
import Movie from '../../models/Movie';
import mimeTypes from './mimeTypes';
import getFileExtension from './getFileExtension';
import startConversion from './startConversion';
import { createSubFile } from './subtitles';

const engineHash = {};

const setUpEngine = (engine, file) => {
  engine.on('download', (pieceIndex) => {
    if (pieceIndex % 10 === 0) {
      const completion = Math.round((100 * engine.swarm.downloaded) / file.length);
      console.log('Completion ', completion, ' %');
      console.log('torrentStream Notice: Engine', engine.infoHash, 'downloaded piece: Index:', pieceIndex, '(', engine.swarm.downloaded, '/', file.length, ')');
    }
  });
  engine.on('idle', () => {
    console.log('torrentStream Notice: Engine', engine.infoHash, 'idle');
    console.log('torrentStream Notice: Engine', engine.infoHash, 'downloaded (',
      engine.swarm.downloaded, '/', file.length, ').');
  });
};

const getFileStreamTorrent = (torrentPath, hash) => new Promise((resolve, reject) => {
  let engine;
  let file;

  const magnet = `magnet:?xt=urn:btih:${hash}`;
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
    setUpEngine(engine, file);
    engineHash[torrentPath] = { engine, file };
    resolve(file);
  });
});

// ROUTE CONTROLLER
export const videoStartTorrenter = async (req, res) => {
  // If download had aleady started
  if (req.torrent.data && req.torrent.data.name) {
    // code to return progress
    return res.json({ error: 'Already started.' });
  }
  console.log('spiderTorrent Notice: Movie not yet torrented; torrenting:', req.torrent.title.en);
  const pathFolder = `./torrents/${req.idImdb}/${req.torrent.hash}`;
  const file = await getFileStreamTorrent(pathFolder, req.torrent.hash);
  const { frSubFilePath, enSubFilePath } = await createSubFile(req.idImdb, req.torrent.hash);
  req.torrent.data = {
    path: `${pathFolder}/${file.path}`,
    enSub: enSubFilePath,
    frSub: frSubFilePath,
    name: file.name,
    size: file.length,
    torrentDate: new Date(),
  };
  startConversion(req.torrent, file.createReadStream(), false);
  console.log(req.torrent.hash, req.idImdb, req.torrent.data);
  await Movie.updateOne({ idImdb: req.idImdb, 'torrents.hash': req.torrent.hash }, { $set: { 'torrents.$.data': req.torrent.data } });
  return res.json({ error: '' });
};

// ROUTE CONTROLLER
export const videoTorrenter = async (req, res) => {
  // If download had aleady started
  console.log(req.torrent.data);
  if (!req.torrent.data || !req.torrent.data.name) {
    return res.json({ error: 'Already has not started.' });
  }
  console.log('spiderTorrent Notice: Movie not yet torrented; torrenting:', req.torrent.title.en);

  const pathFolder = `./torrents/${req.idImdb}/${req.torrent.hash}`;
  const file = await getFileStreamTorrent(pathFolder, req.torrent.hash);
  startConversion(req.torrent, file.createReadStream(), res);
};
