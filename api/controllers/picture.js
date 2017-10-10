import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

import User from '../models/User';

/**
 * POST /signup/upload
 * Save profile picture on signup.
 */

export const postSignupPicture = async (req, res, next) => {
  const { filename } = req.file;
  const { email } = req.headers;

  const oldPath = path.resolve(__dirname, `../public/uploads/tmp/${filename}`);
  const newPath = path.resolve(__dirname, `../public/uploads/${filename}`);

  await sharp(oldPath)
    .resize(240, 240, {
      kernel: sharp.kernel.lanczos2,
      interpolator: sharp.interpolator.nohalo,
    })
    .toFile(newPath);
  if (fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.send({ errorPic: 'Account with that email address does not exist.' });
      }
      // verif if the user has already a pic, which, is unlikely => security purpose, to dig
      if (user.profile.picture) {
        return res.send({ errorPic: 'You can\'t upload a new picture here, go to your profile' });
      }
      user.profile.picture = filename;
      user.save((err) => {
        if (err) { return next(err); }
        return res.send({ errorPic: '' });
      });
    });
};

/**
 * POST /profile_pic
 * Update profile picture on profile.
 */

export const newPicture = async (req, res, next) => {
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, `../public/uploads/tmp/${filename}`);
  const newPath = path.resolve(__dirname, `../public/uploads/${filename}`);

  await sharp(tmpPath)
    .resize(240, 240, {
      kernel: sharp.kernel.lanczos2,
      interpolator: sharp.interpolator.nohalo,
    })
    .toFile(newPath);
  if (fs.existsSync(tmpPath)) {
    fs.unlinkSync(tmpPath);
  }
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    if (user.profile.picture) {
      const oldPath = path.resolve(__dirname, `../public/uploads/${user.profile.picture}`);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    user.profile.picture = filename;
    user.save((err) => {
      if (err) { return next(err); }
      return res.send({ error: [], picture: filename });
    });
  });
};
