import mongoose, { Document } from 'mongoose';
import validator from 'validator';

export interface IContact extends Document {
  type: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  email?: string;
  phone?: string;
  link?: string;
}

const contactSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['person', 'general']
  },
  firstName: {
    type: String,
    required: function() {
      return this.type === 'person';
    },
    minlength: 1,
    trim: true
  },
  lastName: {
    type: String,
    minlength: 1,
    trim: true
  },
  title: {
    type: String,
    minlength: 1,
    trim: true,
    required: function() {
      return this.type === 'general';
    }
  },
  email: {
    type: String,
    minlength: 1,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    },
    required: function() {
      return !(this.phone || this.link);
    }
  },
  phone: {
    type: String,
    minlength: 1,
    trim: true,
    validate: {
      validator: (val: string) => validator.isMobilePhone(val, 'any'),
      message: '{VALUE} is not a valid phone number'
    },
    required: function() {
      return !(this.email || this.link);
    }
  },
  link: {
    type: String,
    minlength: 1,
    trim: true,
    validate: {
      validator: validator.isURL,
      message: '{VALUE} is not a valid URL'
    },
    required: function() {
      return !(this.email || this.phone);
    }
  }
});

const Contact = mongoose.model<IContact>('Contact', contactSchema);
export default Contact;
