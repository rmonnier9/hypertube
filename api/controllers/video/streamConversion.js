import ffmpeg from 'fluent-ffmpeg';
import getFileExtension from './getFileExtension';
import mimeTypes from './mimeTypes';

const ffmpegHash = {};

const startConversion = (torrent, fileStream, res) => new Promise((resolve, reject) => {
  const { data } = torrent;
  const fileExtension = getFileExtension(data.name);
  const mime = mimeTypes[fileExtension];
  if (!mime) { reject(new Error(`streamConversion: Invalid mime type: ${data.name}`)); }

  const converter = ffmpeg()
    .input(fileStream)
    .outputOptions('-movflags frag_keyframe+empty_moov')
    .outputFormat('mp4')
    .output(res)

    .on('codecData', (codecData) => {
      // console.log('fluent-ffmpeg Notice: CodecData:', codecData);
      ffmpegHash[torrent.hash] = codecData;
      resolve();
    })
    .on('start', (cmd) => { console.log('fluent-ffmpeg Notice: Started:', cmd); })
    .on('progress', (progress) => { console.log('fluent-ffmpeg Notice: Progress:', progress.timemark, 'converted'); })
    // .on('error', (err, stdout, stderr) => {
    console.log('ffmpeg, file:', data.path, ' Error:', '\nErr:', err, '\nStdOut:', stdout, '\nStdErr:', stderr);
  });

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
