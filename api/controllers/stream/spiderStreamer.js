import fs from 'fs';
import events from 'events';
import Throttle from 'throttle';
import ffmpeg from 'fluent-ffmpeg';
import mimeTypes from './mimeTypes';

const handler = new events.EventEmitter();

const settings = {
  mode: 'development',
  forceDownload: false,
  rootFolder: 'torrents/',
  rootPath: 'videos/',
  server: 'Hypertube/1.0.0',
  maxAge: '3600',
  throttle: false
};

let ffmpegKeyGen = 0;
const ffmpegHash = {};
const dataHash = {};
const startupDate = new Date();

const spiderStreamer = (data, query, rangeString, res) => {
  let stream;
  const info = {};
  let range;
  let i;
  let timerId;

  const ext = data.name.match(/.*(\..+?)$/);

  if (ext === null || ext.length !== 2 || (info.mime = mimeTypes[ext[1].toLowerCase()]) === undefined) {
    console.error('spiderStreamer Error:'.red, 'Invalid mime type:', data.name);
    handler.emit('badMime', res);
    return false;
  }

  console.error('spiderStreamer Notice: Mime type', info.mime, 'found for file:', data.name);

  info.file = data.name;
  info.path = data.path;
  info.size = data.length;
  info.modified = data.date;

  new Promise(((fulfill, reject) => {
    /* ONLY DO THE FOLLOWING IF NOT MP4, WEBM, OR OGG */
    if (info.mime !== 'video/mp4' && info.mime !== 'video/webm' && info.mime !== 'video/ogg') {
      console.log('spiderStreamer Notice: Needs to be converted to video/mp4:', info.path);
      const oldPath = info.path;
      const convertedPath = `${info.path}.converted.mp4`;
      const convertedFile = `${info.file}.converted.mp4`;
      const key = ++ffmpegKeyGen;
      if (ffmpegHash[oldPath] === undefined) {
        console.log('fluent-ffmpeg Notice:', `${key}:`, 'Movie not yet converted, competing for key...');
        ffmpegHash[oldPath] = key;
      }
      if (ffmpegHash[oldPath] === key) {
        console.log('fluent-ffmpeg Notice:', `${key}:`, 'Chosen for conversion');
        console.log('spiderStreamer Notice: Converting to video/mp4');
        let fails = 0;
        let busy = false;
        const intervalId = setInterval(() => {
          if (!busy) {
            busy = true;
            try {
              // let format = ext[1].slice(1);
              // if (format === 'mkv') format = 'matroska';
              // ffmpeg().input(stream)
              ffmpeg().input(oldPath)
                .on('error', (err, stdout, stderr) => {
                  console.error('spiderStreamer Error:'.red, 'Could not convert file:', oldPath);
                  console.log('fluent-ffmpeg Error:'.red, '\nErr:', err, '\nStdOut:', stdout, '\nStdErr:', stderr);
                  /* Handle error */
                  ++fails;
                  busy = false;
                  // console.log('spiderStreamer Notice: Giving up: Piping raw stream');
                  // stream.pipe(res);
                })
                .on('start', (cmd) => {
                  console.log('fluent-ffmpeg Notice: Started:', cmd);
                })
                .on('codecData', (data) => {
                  console.log('fluent-ffmpeg Notice: CodecData:', data);
                  clearInterval(intervalId);
                  fulfill(data);
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
              // .pipe(res);
            } catch (exception) {
              console.error('spiderStreamer Error:'.red, 'Could not convert file:', oldPath);
              console.error('fluent-ffmpeg Error:'.red, exception);
              /* Handle error */
              ++fails;
              busy = false;
              // console.log('spiderStreamer Notice: Giving up: Piping raw stream');
              // stream.pipe(res);
            }
          } else {
            console.log('fluent-ffmpeg is busy');
          }
          if (fails > 30 && busy === false) {
            clearInterval(intervalId);
            reject('fluent-ffmpeg never launched without error');
          }
        }, 3000);
      } else {
        console.log('fluent-ffmpeg Notice:', `${key}:`, 'Movie already converted');
        fulfill(dataHash[oldPath]);
      }

      info.file = convertedFile;
      info.path = convertedPath;
      info.mime = 'video/mp4';
      // info.modified = startupD;
      info.modified = new Date();
      try {
        info.size = fs.statSync(info.path).size;
      } catch (exception) {
        console.log('spiderStreamer Error:'.red, 'Converted movie size not found');
        info.size = 0;
      }
    } else {
      console.log('spiderStreamer Notice: No conversion needed:', info.mime);
      fulfill(false);
    }
    /* ONLY DO THE ABOVE IF NOT MP4, WEBM, OR OGG */
  })).then(
    () => {
      new Promise(((fulfill, reject) => {
        let fails = 0;
        const intervalId = setInterval(() => {
          try {
            info.size = fs.statSync(info.path).size;
            console.log('spiderStreamer Notice:', info.path, ' size:', info.size);
            if (info.size > 5000000) {
              clearInterval(intervalId);
              fulfill(info.size);
              return;
            }
            console.log('spiderStreamer Notice: Movie file not yet big enough; fails:', fails);
          } catch (exception) {
            console.error('spiderStreamer Error:'.red, exception);
          }
          ++fails;
          if (fails > 30) {
            clearInterval(intervalId);
            reject('Movie file never grew to at least 5mb');
          }
        }, 2000);
      })).then(
        () => {
          info.rangeRequest = false;
          info.start = 0;
          info.end = info.size - 1;
          if (rangeString && rangeString.match(/bytes=(.+)-(.+)?/) !== null) {
            range = rangeString.match(/bytes=(.+)-(.+)?/);
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

          info.length = info.end - info.start + 1;

          console.log('spiderStreamer Notice: Header Info:', info);

          console.log('spiderStreamer Notice: Sending header');
          downloadHeader(res, info);

          // Flash vids seem to need this on the front, even if they start part way through.
          // (JW Player does anyway.)
          // if (info.start > 0 && info.mime === "video/x-flv") {
          // res.write("FLV" + pack("CCNN", 1, 5, 9, 9));
          // }
          try {
            stream = fs.createReadStream(info.path, { flags: 'r', start: info.start, end: info.end });
            if (settings.throttle) {
              stream = stream.pipe(new Throttle(settings.throttle));
            }
            console.log('spiderStreamer Notice: Piping stream...');
            stream.pipe(res);
            console.log('spiderStreamer Notice: Pipe set');
          } catch (exception) {
            stream = null;
            i = 0;
            console.log('spiderStreamer Error:'.red, exception);
            console.log('spiderStreamer Notice: Retrying... i:', i);
            timerId = setInterval(() => {
              ++i;
              if (stream === null) {
                if (i === 5) {
                  clearInterval(timerId);
                  console.error('spiderStreamer Error:'.red, 'Could not stream file:', info.path);
                  /* Can't set headers after they are sent. */
                  // handler.emit("badFile", res);
                  return;
                }

                try {
                  stream = fs.createReadStream(info.path, { flags: 'r', start: info.start, end: info.end });
                } catch (exception) {
                  console.log('spiderStreamer Error:'.red, exception);
                  console.log('spiderStreamer Notice: Retrying in 3 seconds... i:', i);
                  stream = null;
                }
                if (stream !== null) {
                  clearInterval(timerId);
                  if (settings.throttle) {
                    stream = stream.pipe(new Throttle(settings.throttle));
                  }
                  console.log('spiderStreamer Notice: Piping stream...');
                  stream.pipe(res);
                  console.log('spiderStreamer Notice: Pipe set');
                }
              } else if (stream !== null) {
                clearInterval(timerId);
              }
            }, 3000);
          }
        },
        (failure) => {
          console.log('spiderStreamer Error:'.red, failure);
        }
      );
    },
    (failure) => {
      console.log('spiderStreamer Error:'.red, failure);
    }
  );
};

spiderStreamer.settings = (s) => {
  for (let prop in s) {
    settings[prop] = s[prop];
  }
  return spiderStreamer;
};

const downloadHeader = (res, info) => {
  let code = 200;
  let header;

  // 'Connection':'close',
  // 'Cache-Control':'private',
  // 'Transfer-Encoding':'chunked'

  if (settings.forceDownload) {
    header = {
      Expires: 0,
      'Cache-Control': 'must-revalidate, post-check=0, pre-check=0',
      // "Cache-Control": "private",
      'Content-Type': info.mime,
      'Content-Disposition': `attachment; filename=${info.file};`
    };
  } else {
    header = {
      'Cache-Control': `public; max-age=${settings.maxAge}`,
      Connection: 'keep-alive',
      'Content-Type': info.mime,
      'Content-Disposition': `inline; filename=${info.file};`,
      'Accept-Ranges': 'bytes'
    };

    if (info.rangeRequest) {
      // Partial http response
      code = 206;
      header.Status = '206 Partial Content';
      header['Content-Range'] = `bytes ${info.start}-${info.end}/${info.size}`;
    }
  }

  header.Pragma = 'public';
  header['Last-Modified'] = new Date(2016).toUTCString();
  header['Content-Transfer-Encoding'] = 'binary';
  header['Content-Length'] = info.length;
  if (settings.cors) {
    header['Access-Control-Allow-Origin'] = '*';
    header['Access-Control-Allow-Headers'] = 'Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept';
  }
  header.Server = settings.server;

  res.writeHead(code, header);
};

const errorHeader = (res, code) => {
  const header = {
    'Content-Type': 'text/html',
    Server: settings.server
  };

  res.writeHead(code, header);
};

// A tiny subset of http://phpjs.org/functions/pack:880
const pack = (format) => {
  let result = '';

  for (let pos = 1, len = arguments.length; pos < len; pos++) {
    if (format[pos - 1] == 'N') {
      result += String.fromCharCode(arguments[pos] >> 24 & 0xFF);
      result += String.fromCharCode(arguments[pos] >> 16 & 0xFF);
      result += String.fromCharCode(arguments[pos] >> 8 & 0xFF);
      result += String.fromCharCode(arguments[pos] & 0xFF);
    } else {
      result += String.fromCharCode(arguments[pos]);
    }
  }

  return result;
};

const isNumber = n => !isNaN(parseFloat(n)) && isFinite(n);


// handler.on("error", function(err, stdout, stderr) {
// console.log('FFmpegg fucked up:\nErr:', err, '\nStdOut:', stdout, '\nStdErr:', stderr);
// });

handler.on('badMime', (res) => {
  errorHeader(res, 403);
  res.end('<!DOCTYPE html><html lang="en">' +
  '<head><title>403 Forbidden</title></head>' +
  '<body>' +
  '<h1>Sorry...</h1>' +
  '<p>Cannot stream that movie format.</p>' +
  '</body></html>');
});
handler.on('badRange', (res) => {
  errorHeader(res, 403);
  res.end('<!DOCTYPE html><html lang="en">' +
  '<head><title>403 Forbidden</title></head>' +
  '<body>' +
  '<h1>Sorry...</h1>' +
  '<p>Cannot stream that byte range.</p>' +
  '</body></html>');
});
handler.on('badFile', (res) => {
  errorHeader(res, 404);
  res.end('<!DOCTYPE html><html lang="en">' +
  '<head><title>404 Not Found</title></head>' +
  '<body>' +
  '<h1>Sorry...</h1>' +
  '<p>Cannot stream that file.</p>' +
  '</body></html>');
});

/* process.on('uncaughtException', function(e) {
  util.debug(e);
}); */

export default spiderStreamer;
