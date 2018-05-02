import multer from 'multer';
import mime from 'mime';
import crypto from 'crypto';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const uploadDirectory = path.join(__dirname, '..', '..', 'public', 'tmp');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      cb(
        null,
        `${file.fieldname}-${raw.toString(
          'hex'
        )}-${Date.now()}.${mime.getExtension(file.mimetype)}`
      );
    });
  }
});

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 2097152
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/image\/(jpe?g|bmp|png)/)) {
      return cb(null, true);
    }
    return cb(new Error('Mime type not supported'), false);
  }
}).single('image');

export const image = (req: Request, res: Response, next: NextFunction) => {
  uploadImage(req, res, err => {
    if (err) {
        return res.status(400).send(err.message);
    }
    next();
  });
};
