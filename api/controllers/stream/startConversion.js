import ffmpeg from 'fluent-ffmpeg';
import getFileExtension from './getFileExtension';

import mimeTypes from './mimeTypes';

let ffmpegKeyGen = 0;
const ffmpegHash = {};
const dataHash = {};

const startConversion = async (data, fileStream) => {
  const fileExtension = getFileExtension(data.name);
  const mime = !mimeTypes[fileExtension];
  if (!mime) {
    throw new Error(`spiderStreamer: Invalid mime type: ${data.name}`);
  }

  /* ONLY DO THE FOLLOWING IF NOT MP4, WEBM, OR OGG */
  if (mime !== 'video/mp4' && mime !== 'video/webm' && mime !== 'video/ogg') {
    console.log('spiderStreamer Notice: Needs to be converted to video/mp4:', data.path);
    const oldPath = data.path;
    const convertedPath = `${data.path}.converted.mp4`;
    const key = ++ffmpegKeyGen;
    if (ffmpegHash[oldPath] === undefined) {
      console.log('fluent-ffmpeg Notice:', `${key}:`, 'Movie not yet converted, competing for key...');
      ffmpegHash[oldPath] = key;
      console.log('fluent-ffmpeg Notice:', `${key}:`, 'Chosen for conversion');
      console.log('spiderStreamer Notice: Converting to video/mp4');
      ffmpeg().input(fileStream)
        .on('error', (err, stdout, stderr) => {
          console.error('spiderStreamer Error:'.red, 'Could not convert file:', oldPath);
          console.log('fluent-ffmpeg Error:'.red, '\nErr:', err, '\nStdOut:', stdout, '\nStdErr:', stderr);
        })
        .on('start', (cmd) => {
          console.log('fluent-ffmpeg Notice: Started:', cmd);
        })
        .on('codecData', (data) => {
          console.log('fluent-ffmpeg Notice: CodecData:', data);
          dataHash[oldPath] = data;
        })
      // .on('progress', function(progress) {
      // console.log('fluent-ffmpeg Notice: Progress:', progress.timemark, 'converted');
      // })
      // .inputFormat(format)
        .audioCodec('aac')
        .videoCodec('libx264')
        .output(convertedPath)
        .outputFormat('mp4')
        .outputOptions('-movflags frag_keyframe+empty_moov')
        .run();
    } else {
      console.log('spiderStreamer Notice: No conversion needed:', mime);
    }
  }
  /* ONLY DO THE ABOVE IF NOT MP4, WEBM, OR OGG */
};

export default startConversion;
