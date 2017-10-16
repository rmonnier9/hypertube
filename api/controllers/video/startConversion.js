import ffmpeg from 'fluent-ffmpeg';
import getFileExtension from './getFileExtension';

import mimeTypes from './mimeTypes';

const ffmpegHash = {};

const startConversion = (torrent, fileStream) => new Promise((resolve, reject) => {
  const { data } = torrent;
  const fileExtension = getFileExtension(data.name);
  const mime = mimeTypes[fileExtension];
  if (!mime) {
    reject(new Error(`spiderStreamer: Invalid mime type: ${data.name}`));
  }

  // NO CONVERSION NEEDED
  // if (mime === 'video/mp4' || mime === 'video/webm' || mime === 'video/ogg') {
  //   console.log('spiderStreamer Notice: No conversion needed:', mime);
  //   return resolve();
  // }

  // ALREADY CONVERTING
  if (ffmpegHash[torrent.hash]) {
    console.log('startConversion Notice: Already converting');
    return resolve();
  }

  // SET NEW PATH
  data.oldPath = data.path;
  data.path = `${data.oldPath}.converted.mp4`;

  const converter = ffmpeg().input(fileStream);
  console.log('spiderStreamer Notice: Starting conversion to video/mp4 for ', data.oldPath);
  converter.on('error', (err, stdout, stderr) => {
    console.error('spiderStreamer Error:'.red, 'Could not convert file:', data.oldPath);
    console.log('fluent-ffmpeg Error:'.red, '\nErr:', err, '\nStdOut:', stdout, '\nStdErr:', stderr);
  })
    .on('start', (cmd) => {
      console.log('fluent-ffmpeg Notice: Started:', cmd);
    })
    .on('codecData', (codecData) => {
      console.log('fluent-ffmpeg Notice: CodecData:', codecData);
      ffmpegHash[torrent.hash] = codecData;
      resolve();
    })
    .on('progress', (progress) => {
      console.log('fluent-ffmpeg Notice: Progress:', progress.timemark, 'converted');
    })
    .output(data.path);
  if (fileExtension === '.mkv') {
    converter.addOption('-vcodec')
      .addOption('copy')
      .addOption('-acodec')
      .addOption('copy')
      .run();
  } else {
    converter.inputFormat(fileExtension.substr(1))
      .audioCodec('aac')
      .videoCodec('libx264')
      .outputFormat('mp4')
      .outputOptions('-movflags frag_keyframe+empty_moov')
      .run();
  }
});

export default startConversion;
