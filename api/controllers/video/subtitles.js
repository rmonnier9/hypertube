import OS from 'opensubtitles-api';
import fs from 'fs';
import mkdirp from 'mkdirp';
import srt2vtt from 'srt2vtt';
import axios from 'axios';
import Movie from '../../models/Movie';

const OpenSubtitles = new OS({
  useragent: 'OSTestUserAgentTemp',
  ssl: true
});


const convert = (path) => {
  const newPath = `${path.slice(0, -4)}.vtt`;
  const srtData = fs.readFileSync(path);
  srt2vtt(srtData, (err, vttData) => {
    if (err) throw new Error(err);
    fs.writeFileSync(newPath, vttData);
  });
};

const getSubPath = async (url, id, hash, name) => {
  if (url !== 'none') {
    const { data } = await axios.get(url);
    const dirPath = `./public/subs/${id}/${hash}`;
    mkdirp.sync(dirPath);
    const fullPath = `subs/${id}/${hash}/${name}.vtt`;
    fs.writeFile(`./public/subs/${id}/${hash}/${name}.srt`, data, (err) => {
      if (err) throw err;
      else convert(`./public/subs/${id}/${hash}/${name}.srt`);
    });
    return fullPath;
  }
  return 'none';
};

export const createSubFile = async (idImdb, hash) => {
  const subtitleInfo = await OpenSubtitles.search({ imdbid: idImdb });
  const frObject = subtitleInfo.fr;
  const enObject = subtitleInfo.en;
  const frUrl = frObject ? frObject.url : 'none';
  const enUrl = enObject ? enObject.url : 'none';
  const frSubFilePath = await getSubPath(frUrl, idImdb, hash, 'frsub');
  const enSubFilePath = await getSubPath(enUrl, idImdb, hash, 'ensub');
  return { frSubFilePath, enSubFilePath };
};

export const getSub = async (req, res) => {
  const { idImdb, hash } = req.params;
  if (!idImdb || !hash) return res.send({ error: 'invalid parameters' });
  const results = await Movie.findOne({ idImdb, 'torrents.hash': hash });
  const torrent = results.torrents.filter(torrent => (torrent.hash === hash));
  console.log('Sub torrent', torrent);
  if (!torrent[0].data) return res.send({ error: 'nosub' });
  console.log('FR');
  const { frSubFilePath, enSubFilePath } = torrent[0].data;
  console.log('FR', frSubFilePath);
  console.log('EN', enSubFilePath);
  return res.send({ error: '', frSubFilePath, enSubFilePath });
};
