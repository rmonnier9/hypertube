import torrentStream from 'torrent-stream';
import mimeTypes from './config.json';

const magnet = 'magnet:?xt=urn:btih:aee0f0082cc2f449412c1dd8af4c58d9aaee4b5c&dn=Charlie_Chaplin_Mabels_Strange_Predicament.avi';
const engine = torrentStream(magnet);

const extension = 'dfdfdf.dfd.mp4'.match(/\..+?$/);
console.log(extension);
if (extension === null || extension.length !== 2) {
  console.error('spiderStreamer Error:', 'Invalid mime type:');
  // res.json({ error: 'badMime' });
}

// engine.on('ready', () => {
//   engine.files.forEach((file) => {
//     console.log('filename:', file.name);
//     const stream = file.createReadStream();
//     // stream is readable stream to containing the file content
//   });
// });
