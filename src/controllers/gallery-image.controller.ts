import { ObjectID } from 'mongodb';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import GalleryImage from '../models/gallery-image.model';
import { pick } from '../util/util';

const galleryDirectory = path.join(
  __dirname,
  '..',
  '..',
  'public',
  'img',
  'gallery'
);

import jimp from 'jimp';

export const post = (req: Request, res: Response) => {
  const fileName = req.file.filename;
  const filePath = req.file.path;
  const destination = path.join(galleryDirectory, fileName);

  jimp
    .read(filePath)
    .then(image => {
      if (image.bitmap.width > 1000) {
        return image.resize(1000, jimp.AUTO);
      }
      return image;
    })
    .then(image => {
      return image.quality(80).write(destination);
    })
    .then(() => {
      fs.unlink(filePath, err => {
        if (err) throw err;
        return;
      });
    })
    .then(() => {
      const galleryImage = new GalleryImage({
        filename: fileName,
        title: req.body.title
      });
      galleryImage.save().then(galleryImage => res.send(galleryImage));
    })
    .catch(err => res.status(500).send(err));
};
