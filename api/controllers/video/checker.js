import Movie from '../../models/Movie';

// VIDEO CHECKER
// check input and populate request object
// with req.movie and req.torrent

const videoChecker = async (req, res, next) => {
  // console.log('videoChecker Notice: Request:', req);
  console.log('videoChecker Notice: Query:', req.params);
  console.log('videoChecker Notice: Headers:', req.headers);

  // INPUT CHECK
  const { idImdb, hash } = req.params;
  if (!idImdb) {
    next(new Error('No idImdb.'));
  } else if (!hash) {
    next(new Error('No torrent hash.'));
  }
  const movie = await Movie.findOne({ idImdb, 'torrents.hash': hash }, { idImdb: 1, 'torrents.$': 1 });
  if (!movie) {
    next(new Error('Movie not found.'));
  }
  req.idImdb = movie.idImdb;
  req.torrent = movie.torrents[0];
  next();
};

// import ffmpeg from 'fluent-ffmpeg';
// import fs from 'fs';
// import getFileExtension from './getFileExtension';
// import mimeTypes from './mimeTypes';
// import torrentStream from 'torrent-stream';
//
// const engineHash = {};
//
// const setUpEngine = (engine, file) => {
//   engine.on('download', (pieceIndex) => {
//     if (pieceIndex % 10 === 0) {
//       const completion = Math.round((100 * engine.swarm.downloaded) / file.length);
//       console.log('Completion ', completion, ' %');
//       console.log('torrentStream Notice: Engine', engine.infoHash, 'downloaded piece: Index:', pieceIndex, '(', engine.swarm.downloaded, '/', file.length, ')');
//     }
//   });
//   engine.on('idle', () => {
//     console.log('torrentStream Notice: Engine', engine.infoHash, 'idle');
//     console.log('torrentStream Notice: Engine', engine.infoHash, 'downloaded (',
//       engine.swarm.downloaded, '/', file.length, ').');
//   });
// };
//
// const getFileStreamTorrent = (torrentPath, hash) => new Promise((resolve, reject) => {
//   let engine;
//   let file;
//
//   const magnet = `magnet:?xt=urn:btih:${hash}`;
//   // DOWNLOAD HAD ALREADY STARTED
//   if (engineHash[torrentPath]) {
//     engine = engineHash[torrentPath].engine;
//     file = engineHash[torrentPath].file;
//     resolve(file);
//   }
//
//   // DOWNLOAD HAD NOT ALREADY STARTED
//   engine = torrentStream(magnet, { path: torrentPath });
//   engine.on('ready', () => {
//     engine.files.forEach((current) => {
//       // Look for valid movie file extension and select the biggest file
//       const fileExtension = getFileExtension(current.name);
//       if (!mimeTypes[fileExtension]) {
//         // Ignore non-movie files
//         console.log('Skipping item: non-movie file', current.name, '| size:', current.length);
//       } else if (file && current.length < file.length) {
//         // Already a bigger movie file
//         console.log('Skipping item: not the biggest file', current.name, '| size:', current.length);
//       } else {
//         console.log('Movie file found:', current.name, '| size:', current.length);
//         file = current;
//       }
//     });
//     if (!file) {
//       engine.removeAllListeners();
//       engine.destroy();
//       reject(new Error('no valid movie file found.'));
//     }
//     file.select();
//     setUpEngine(engine, file);
//     engineHash[torrentPath] = { engine, file };
//     resolve(file);
//   });
// });
//
// const videoChecker = async (req, res, next) => {
//   // console.log('videoChecker Notice: Request:', req);
//   console.log('videoChecker Notice: Query:', req.params);
//   console.log('videoChecker Notice: Headers:', req.headers);
//
//   // INPUT CHECK
//   const { idImdb, hash } = req.params;
//   if (!idImdb) {
//     next(new Error('No idImdb.'));
//   } else if (!hash) {
//     next(new Error('No torrent hash.'));
//   }
//   const movie = await Movie.findOne({ idImdb, 'torrents.hash': hash }, { idImdb: 1, 'torrents.$': 1 });
//   if (!movie) {
//     next(new Error('Movie not found.'));
//   }
//   const pathFolder = `./torrents/${idImdb}/${hash}`;
//   const file = await getFileStreamTorrent(pathFolder, hash);
//   // const fileStream = fs.createReadStream('./torrents/tt6836772/4CFD5C9ABAD3E23DAE84145A4B598ABBC8E67DD5/Operation Dunkirk (2017) [YTS.AG]/Operation.Dunkirk.2017.720p.BluRay.x264-[YTS.AG].mp4');
//   const fileStream = file.createReadStream();
//   const converter = ffmpeg().input(fileStream);
//   console.log('spiderStreamer Notice: Starting conversion to video/mp4 for ');
//   converter.on('error', (err, stdout, stderr) => {
//     console.error('spiderStreamer Error:'.red, 'Could not convert file:');
//     console.log('fluent-ffmpeg Error:'.red, '\nErr:', err, '\nStdOut:', stdout, '\nStdErr:', stderr);
//   })
//     .on('start', (cmd) => {
//       console.log('fluent-ffmpeg Notice: Started:', cmd);
//     })
//     .on('codecData', (codecData) => {
//       console.log('fluent-ffmpeg Notice: CodecData:', codecData);
//     })
//     .on('progress', (progress) => {
//       console.log('fluent-ffmpeg Notice: Progress:', progress.timemark, 'converted');
//     })
//     .output(`${pathFolder}/converted.mp4`)
//     .output(res)
//
//     .inputFormat('mp4')
//     .audioCodec('aac')
//     .videoCodec('libx264')
//     .outputFormat('mp4')
//     .outputOptions('-movflags frag_keyframe+empty_moov')
//     .run();
// };

export default videoChecker;
