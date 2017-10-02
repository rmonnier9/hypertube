const mimeTypes = {
  '.flv': 'video/x-flv',
  '.f4v': 'video/mp4',
  '.f4p': 'video/mp4',
  '.mp4': 'video/mp4',
  '.mkv': 'video/matroska', /* FAST PATCH (POSSIBLY MUST FIX LATER) (SHOULD ACTUALLY BE CONVERTED FROM video/mkv TO WHATEVER) */
  '.asf': 'video/x-ms-asf',
  '.asr': 'video/x-ms-asf',
  '.asx': 'video/x-ms-asf',
  '.avi': 'video/x-msvideo',
  '.mpa': 'video/mpeg',
  '.mpe': 'video/mpeg',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.mpv2': 'video/mpeg',
  '.mov': 'video/quicktime',
  '.movie': 'video/x-sgi-movie',
  '.mp2': 'video/mpeg',
  '.qt': 'video/quicktime',
  '.webm': 'video/webm',
  '.ts': 'video/mp2t',
  '.ogg': 'video/ogg'
};

export default mimeTypes;
