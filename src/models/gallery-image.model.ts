import { Document, Schema, Model, model } from 'mongoose';
import validator from 'validator';

export interface IGalleryImage extends Document {
  filename: string;
  title: string;
}

const galleryImageSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled image',
    minlength: 1,
    trim: true
  }
});

const GalleryImage = model<IGalleryImage>('GalleryImage', galleryImageSchema);
export default GalleryImage;
