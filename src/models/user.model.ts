import { Document, Schema, Model, model, DocumentQuery, Query } from 'mongoose';
import validator from 'validator';
import { IMember } from './member.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { access } from 'fs';
import { resolve } from 'path';
import { pick } from '../util/util';

export interface IToken {
  access: string;
  token: string;
}

export interface IUserDocument extends Document {
  email: string;
  username: string;
  password: string;
  type: string;
  tokens: IToken[];
}

export interface IUser extends IUserDocument {
  removeToken(token: string): Promise<any>;
  generateAuthToken(): Promise<string>;
}

export interface IUserModel extends Model<IUser> {
  findByToken(token: string | undefined): any;
  findByCredentials(username: string, password: string): Promise<IUser>;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  type: {
    type: String,
    trim: true,
    required: true,
    default: 'user',
    enum: ['user', 'admin', 'super']
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  // TODO fix for production env
  const token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        access
      },
      process.env.JWT_SECRET || ''
    )
    .toString();

  user.tokens = user.tokens.concat([
    {
      access,
      token
    }
  ]);
  return user.save().then(() => {
    return token;
  });
};

userSchema.methods.removeToken = function(token: string) {
  const user = this;

  return user.update({
    $pull: {
      tokens: { token }
    }
  });
};

userSchema.statics.findByToken = function(token: string) {
  const User = this;

  let decoded: { _id: string; access: string };
  try {
    // TODO fix for production env
    decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
      _id: string;
      access: string;
    };
  } catch (e) {
    return Promise.reject(new Error('JWT verification failed'));
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

userSchema.statics.findByCredentials = function(
  username: string,
  password: string
) {
  const User = this;

  return User.findOne({ username }).then((user: IUser | null) => {
    if (!user) {
      return Promise.reject(new Error('User not found'));
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  return pick(userObject, ['_id', 'email', 'username']);
};

userSchema.pre('save', function(next) {
  const user = this as IUser;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.pre('findOneAndUpdate', function(next) {
  const query: Query<IUserDocument> = this;

  const update = query.getUpdate();

  if (update.$set.password) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(update.$set.password, salt, (err, hash) => {
        update.$set.password = hash;

        query.findOneAndUpdate({}, update);
        next();
      });
    });
  } else {
    next();
  }
});

const User: IUserModel = model<IUser, IUserModel>('User', userSchema);
export default User;
