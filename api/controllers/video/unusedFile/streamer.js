/*!
* streamer.js
*
* Copyright (c) 2017 Robin Monnier
* Version 0.1
*/

import getFilePointer from './getFilePointer';

export const getStream = async (req, res) => {
  const { hash } = req.params;

  /*
    get file pointer (hard copy or torrent) and file size
  */
  const file = await getFilePointer(hash);
  const fileSize = file.length;

  /*
      compute info about bytes requested
      start : starting byte
      end : ending byte
      chunkSize : total bytes being sent
  */
  const range = req.headers.range;
  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = (end - start) + 1;

  /*
    send HTTP headers
  */
  const head = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4',
  };
  res.writeHead(206, head);

  /*
    create stream and pipe it
  */
  const stream = file.createReadStream({ start, end });
  stream.pipe(res);
};

export default getStream;
