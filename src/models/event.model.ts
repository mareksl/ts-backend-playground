import mongoose, { Document } from 'mongoose';
import validator from 'validator';

export interface IEvent extends Document {
  location: string;
  date: number;
  description: string;
  link: string;
}

const eventSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  date: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true,
    validate: {
      validator: validator.isURL,
      message: '{VALUE} is not a valid URL'
    }
  }
});

const Event = mongoose.model<IEvent>('Event', eventSchema);
export default Event;
