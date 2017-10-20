import fs from 'fs';
import Movie from '../../models/Movie';

const deleteFolderRecursive = (path) => {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const deleteAll = async (req, res) => {
  const { idImdb, hash } = req.params;
  console.log('id', idImdb);
  console.log('hash', hash);
  await deleteFolderRecursive(`./torrents/${idImdb}/${hash}`);
  await deleteFolderRecursive(`./public/subs/${idImdb}/${hash}`);
  // await Movie.update({}, { $unset: { 'torrents.data': '' } });
  await Movie.update({ idImdb, 'torrents.hash': hash, 'torrents.data': { $exists: true } }, { $unset: { 'torrents.$.data': '' } });
  return res.send({ err: '' });
};

export default deleteAll;
