import bluebird from 'bluebird';
import mimeTypes from './mimeTypes';
import getFileExtension from './getFileExtension';

const fs = bluebird.promisifyAll(require('fs'));

const settings = {
  cors: false,
  server: 'Hypertube/1.0.0',
  maxAge: '3600',
};

const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n);

const spiderStreamer = (data, req, res) => (
  new Promise(((resolve, reject) => {
    let fails = 0;
    const intervalId = setInterval(async () => {
      const stat = await fs.statAsync(data.path);
      console.log('spiderStreamer Notice:', data.path, ' size:', stat.size);
      if (stat.size > 5000000) {
        clearInterval(intervalId);
        resolve(stat.size);
      } else {
        console.log('spiderStreamer Notice: Movie file not yet big enough; fails:', fails);
        ++fails;
        if (fails > 30) {
          clearInterval(intervalId);
          reject('Movie file never grew to at least 5mb');
        }
      }
    }, 2000);
  })).then(
    (size) => {
      const info = {};
      info.rangeRequest = false;
      info.start = 0;
      info.end = size - 1;
      info.size = size;
      const fileExtension = getFileExtension(data.name);
      const mime = mimeTypes[fileExtension];
      info.mime = mime;

      let { range } = req.headers;
      const { query } = req;

      if (range && range.match(/bytes=(.+)-(.+)?/) !== null) {
        range = range.match(/bytes=(.+)-(.+)?/);
        if (isNumber(range[1]) && range[1] >= 0 && range[1] < info.end) {
          info.start = range[1] - 0;
        }
        if (isNumber(range[2]) && range[2] > info.start && range[2] <= info.end) {
          info.end = range[2] - 0;
        }
        info.rangeRequest = true;
      } else if (query.start || query.end) {
        // This is a range request, but doesn't get range headers. So there.
        if (isNumber(query.start) && query.start >= 0 && query.start < info.end) {
          info.start = query.start - 0;
        }
        if (isNumber(query.end) && query.end > info.start && query.end <= info.end) {
          info.end = query.end - 0;
        }
      }
      console.log('spiderStreamer Notice: Header Info:', info);

      console.log('spiderStreamer Notice: Sending header');
      downloadHeader(res, info);

      const stream = fs.createReadStream(data.path, { flags: 'r', start: info.start, end: info.end });
      console.log('spiderStreamer Notice: Piping stream...');
      stream.pipe(res);
      console.log('spiderStreamer Notice: Pipe set');
    })
);

const downloadHeader = (res, info) => {
  let code = 200;
  let header;

  header = {
    'Cache-Control': `public; max-age=${settings.maxAge}`,
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
  header['Last-Modified'] = new Date(2016).toUTCString();
  header['Content-Transfer-Encoding'] = 'binary';
  header['Content-Length'] = info.size;
  if (settings.cors) {
    header['Access-Control-Allow-Origin'] = '*';
    header['Access-Control-Allow-Headers'] = 'Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept';
  }
  header.Server = settings.server;

  res.writeHead(code, header);
};

export default spiderStreamer;
