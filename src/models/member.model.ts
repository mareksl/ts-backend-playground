import mongoose, { Document } from 'mongoose';
import validator from 'validator';

export interface IMember extends Document {
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  order: number;
  role: string;
}

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  lastName: {
    type: String,
    minlength: 1,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    minlength: 1
  },
  avatar: {
    type: String,
    trim: true,
    // validate: {
    //   validator: validator.isURL,
    //   message: '{VALUE} is not a valid URL'
    // }
  },
  order: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    trim: true,
    minlength: 1
  }
});

const Member = mongoose.model<IMember>('Member', memberSchema);
export default Member;
