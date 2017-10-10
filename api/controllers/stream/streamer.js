import bluebird from 'bluebird';
import mimeTypes from './mimeTypes';
import getFileExtension from './getFileExtension';

const fs = bluebird.promisifyAll(require('fs'));

const settings = {
  server: 'Hypertube/1.0.0',
  maxAge: '3600',
};

const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n);

const downloadHeader = (res, info) => {
  let code = 200;

  const header = {
    // 'Cache-Control': `public; max-age=${settings.maxAge}`,
    Connection: 'keep-alive',
    'Content-Type': info.mime,
    'Content-Disposition': `inline; filename=${info.name};`,
    'Accept-Ranges': 'bytes'
  };

  if (info.rangeRequest) {
    // Partial http response
    code = 206;
    header.Status = '206 Partial Content';
    header['Content-Range'] = `bytes ${info.start}-${info.end}/${info.size}`;
  }

  header.Pragma = 'public';
  header['Last-Modified'] = info.modified.toUTCString();
  header['Content-Transfer-Encoding'] = 'binary';
  header['Content-Length'] = info.length;
  header.Server = settings.server;

  res.writeHead(code, header);
};

const videoStream = (req, res) => {
  const { path, name } = req.torrent;

  return new Promise(((resolve, reject) => {
    let fails = 0;
    const intervalId = setInterval(async () => {
      const stat = await fs.statAsync(path);
      console.log('videoStream Notice:', path, ' size:', stat.size);
      if (stat.size > 5000000) {
        clearInterval(intervalId);
        resolve({ size: stat.size, modified: stat.mtime });
      } else {
        console.log('videoStream Notice: Movie file not yet big enough; fails:', fails);
        ++fails;
        if (fails > 30) {
          clearInterval(intervalId);
          reject('Movie file never grew to at least 5mb');
        }
      }
    }, 2000);
  })).then(
    ({ size, modified }) => {
      const info = {};
      info.name = name;
      info.start = 0;
      info.end = size - 1;
      info.size = size;
      info.modified = modified;
      info.rangeRequest = false;

      const fileExtension = getFileExtension(name);
      const mime = mimeTypes[fileExtension];
      console.log(fileExtension, mime);
      info.mime = mime;

      let { range } = req.headers;
      if (range && range.match(/bytes=(.+)-(.+)?/)) {
        range = range.match(/bytes=(.+)-(.+)?/);
        if (isNumber(range[1]) && range[1] >= 0 && range[1] < info.end) {
          info.start = range[1] - 0;
        }
        if (isNumber(range[2]) && range[2] > info.start && range[2] <= info.end) {
          info.end = range[2] - 0;
        }
        info.rangeRequest = true;
      }
      info.length = (info.end - info.start) + 1;

      console.log('videoStream Notice: Sending header');
      downloadHeader(res, info);

      const stream = fs.createReadStream(path, { flags: 'r', start: info.start, end: info.end });
      stream.pipe(res);
    });
};

export default videoStream;
