import jimp from 'jimp';
import fs from 'fs';

interface ProcessImageOptions {
  filePath: string;
  quality: number;
  maxWidth: number;
  destination: string;
}
type ProcessImageFunction = (opts: ProcessImageOptions) => Promise<void>;

export const processImage: ProcessImageFunction = options => {
  return jimp
    .read(options.filePath)
    .then(image => {
      if (image.bitmap.width > options.maxWidth) {
        return image.resize(options.maxWidth, jimp.AUTO);
      }
      return image;
    })
    .then(image => {
      return image.quality(options.quality).write(options.destination);
    })
    .then(() => {
      fs.unlink(options.filePath, err => {
        if (err) throw err;
        return;
      });
    });
};

export default {
  processImage
};
