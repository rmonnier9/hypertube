import torrentStream from 'torrent-stream';

/*
  extract file extension
  if error, returns an empty string
*/
const getFileExtension = (name) => {
  if (typeof name !== typeof '') return '';

  const extension = name.match(/\.[^.]+$/);

  if (extension === null) return '';
  return extension[0].toLowerCase();
};


const engineHashTable = {};

const getTorrentEngine = async hash => (
  new Promise((resolve, reject) => {
    const magnet = `magnet:?xt=urn:btih:${hash}`;
    const engine = torrentStream(magnet);
    engine.on('ready', () => {
      engine.files.forEach((file) => {
        const extension = getFileExtension(file.name);
        if (extension === '.mp4') {
          engineHashTable[hash] = { file, engine };
          resolve(file);
        }
      });
    });
  })
);

const getFilePointer = async (hash) => {
  if (!engineHashTable[hash]) {
    const file = await getTorrentEngine(hash);
    return file;
  }
  return engineHashTable[hash].file;
};

export default getFilePointer;
