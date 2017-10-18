import ffmpeg from 'fluent-ffmpeg';
import getFileExtension from './getFileExtension';
import Movie from '../../models/Movie';
import mimeTypes from './mimeTypes';

const ffmpegHash = {};

const startConversion = (torrent, fileStream, res) => new Promise((resolve, reject) => {
  const { data } = torrent;
  const hash = torrent;
  const fileExtension = getFileExtension(data.name);
  const mime = mimeTypes[fileExtension];
  if (!mime) {
    reject(new Error(`spiderStreamer: Invalid mime type: ${data.name}`));
  }

  // SET NEW PATH
  data.oldPath = data.path;
  data.path = `${data.oldPath}.converted.mp4`;

  console.log('spiderStreamer Notice: Starting conversion to video/mp4 for ', data.oldPath);
  const converter = ffmpeg()
    .input(fileStream)
    .outputOptions('-movflags frag_keyframe+empty_moov')
    .outputFormat('mp4')
    .on('error', (err, stdout, stderr) => {
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
    .on('end', () => {
      Movie.updateOne({ 'torrents.hash': hash }, { $set: { 'torrents.$.data.downloaded': true } });
      console.log('Transcoding succeeded !');
    });
  if (res === false) {
    converter.output(data.path);
  } else {
    converter.output(res);
  }
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
      .run();
  }
});

export default startConversion;
