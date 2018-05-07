import { ObjectID } from 'mongodb';
import Event from '../../src/models/event.model';
import Member from '../../src/models/member.model';
import Contact from '../../src/models/contact.model';
import GalleryImage from '../../src/models/gallery-image.model';
import User from '../../src/models/user.model';
import rimraf from 'rimraf';
import fs from 'fs';
import jwt from 'jsonwebtoken';

export const events = [
  {
    _id: new ObjectID(),
    location: 'Sopot',
    date: 123,
    description: 'Description',
    link: 'https://google.com'
  },
  {
    _id: new ObjectID(),
    location: 'Gdynia',
    date: 321,
    description: 'Description',
    link: 'https://google.com'
  }
];

export const populateEvents = done => {
  Event.remove({})
    .then(() => {
      return Event.insertMany(events);
    })
    .then(() => done());
};

export const members = [
  {
    _id: new ObjectID(),
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Some bio here',
    avatar: 'https://google.com',
    order: 1,
    role: 'Bass'
  },
  {
    _id: new ObjectID(),
    firstName: 'Jane',
    lastName: 'Doe'
  }
];

export const populateMembers = done => {
  Member.remove({})
    .then(() => {
      return Member.insertMany(members);
    })
    .then(() => done());
};

export const contacts = [
  {
    _id: new ObjectID(),
    type: 'person',
    firstName: 'Andy',
    lastName: 'Moon',
    title: 'Secretary',
    email: 'andy@example.com',
    phone: '789456123',
    link: 'https://andy.example.com'
  },
  {
    _id: new ObjectID(),
    type: 'general',
    title: 'Recording Label',
    link: 'https://example.com'
  }
];

export const populateContacts = done => {
  Contact.remove({})
    .then(() => {
      return Contact.insertMany(contacts);
    })
    .then(() => done());
};

export const galleryImages = [
  {
    _id: new ObjectID(),
    filename: 'test1.jpg',
    title: 'Test image 1'
  },
  {
    _id: new ObjectID(),
    filename: 'test1.png',
    title: 'Test image 2'
  }
];

export const populateGalleryImages = done => {
  GalleryImage.remove({})
    .then(() => {
      return GalleryImage.insertMany(galleryImages);
    })
    .then(() => done());
};

export const copySeedImage = done => {
  const stream = fs
    .createReadStream('./tests/seed/files/test1.png')
    .pipe(fs.createWriteStream('./public/img/gallery/test1.png'));
  stream.on('finish', done);
};

export const deleteGalleryImages = done => {
  rimraf('./public/img/gallery/*', done);
};

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

export const users = [
  {
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    username: 'userOne',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'john@example.com',
    password: 'userTwoPass',
    username: 'userTwo',
    tokens: [
      {
        access: 'auth',
        token: jwt
          .sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  }
];

export const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};
