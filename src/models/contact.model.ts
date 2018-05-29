import { Document, Schema, Model, model, SchemaDefinition } from 'mongoose';
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
// HACK
interface ContactSchema {
  type: { [key: string]: any };
  firstName?: { [key: string]: any };
  lastName?: { [key: string]: any };
  title?: { [key: string]: any };
  email?: { [key: string]: any };
  phone?: { [key: string]: any };
  link?: { [key: string]: any };
}

const contactSchema = new Schema(<SchemaDefinition & ContactSchema>{
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
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true,
    required: function() {
      return this.type === 'general';
    }
  },
  email: {
    type: String,
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

const Contact: Model<IContact> = model<IContact>('Contact', contactSchema);
export default Contact;
