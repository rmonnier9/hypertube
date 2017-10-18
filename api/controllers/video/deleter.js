import fs from 'fs';
import Movie from '../../models/Movie';

const deleteFolderRecursive = (path) => {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const deleteAll = async (req, res) => {
  const { idImdb } = req.params;
  await deleteFolderRecursive('./torrents');
  await deleteFolderRecursive('./public/subs');
  // await Movie.update({}, { $unset: { 'torrents.data': '' } });
  await Movie.update({ idImdb, 'torrents.data': { $exists: true } }, { $unset: { 'torrents.$.data': '' } });
  return res.send({ err: '' });
};

export default deleteAll;
