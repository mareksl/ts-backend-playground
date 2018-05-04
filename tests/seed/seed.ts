import { ObjectID } from 'mongodb';
import Event from '../../src/models/event.model';
import Member from '../../src/models/member.model';
import Contact from '../../src/models/contact.model';
import GalleryImage from '../../src/models/gallery-image.model';
import rimraf from 'rimraf';
import fs from 'fs';

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
    filename: 'test2.png',
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
    .pipe(
      fs.createWriteStream(
        './public/img/gallery/test2.png'
      )
    );
  stream.on('finish', done);
};

export const deleteGalleryImages = done => {
  rimraf('./public/img/gallery/*', done);
};
