import { ObjectID } from 'mongodb';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import GalleryImage, { IGalleryImage } from '../models/gallery-image.model';
import { pick } from '../util/util';
import ImageProcessor from '../util/imageProcessor';

const galleryDirectory = path.join(
  __dirname,
  '..',
  '..',
  process.env.UPLOAD_DIRECTORY || 'upload',
  'img',
  'gallery'
);

export const post = (req: Request, res: Response) => {
  const fileName = req.file.filename;
  const filePath = req.file.path;
  const destination = path.join(galleryDirectory, fileName);

  ImageProcessor.processImage({
    filePath: filePath,
    maxWidth: 1000,
    quality: 60,
    destination: destination
  })
    .then(() => {
      const galleryImage = new GalleryImage({
        filename: fileName,
        title: req.body.title
      });

      galleryImage.save().then(image => res.send({ image }));
    })
    .catch(err => res.status(400).send(err));
};

export const get = (req: Request, res: Response) => {
  GalleryImage.find()
    .then(images => {
      res.send({ images });
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

export const getById = (req: Request, res: Response) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  GalleryImage.findById(id)
    .then(image => {
      if (!image) {
        return res.status(404).send();
      }
      res.sendFile(path.join(galleryDirectory, image.filename));
    })
    .catch(e => res.status(400).send(e));
};

export const deleteById = (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  GalleryImage.findByIdAndRemove(id)
    .then(image => {
      if (!image) {
        return res.status(404).send();
      }
      const filePath = path.join(galleryDirectory, image.filename);
      return fs.unlink(filePath, err => {
        if (err) return res.status(500).send(err);
        res.send({ image });
      });
    })
    .catch(e => res.status(400).send(e));
};

export const patch = (req: Request, res: Response) => {
  const id = req.params.id;
  const body = pick(req.body, ['title']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  GalleryImage.findByIdAndUpdate(
    id,
    {
      $set: body
    },
    { new: true, runValidators: true }
  )
    .then(image => {
      if (!image) {
        res.status(404).send();
      }
      res.send({ image });
    })
    .catch(e => res.status(400).send(e));
};
