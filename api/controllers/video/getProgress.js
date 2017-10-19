import bluebird from 'bluebird';

const fs = bluebird.promisifyAll(require('fs'));

const getProgress = async (req, res) => {
  const { path } = req.torrent.data;
  const stat = await fs.statAsync(path);
  const progress = Math.round((stat.size / 4000000) * 100);
  return res.send({ progress });
};

export default getProgress;
