import request from 'supertest';
import app from '../src/app';
import fs from 'fs';

import { ObjectID } from 'mongodb';

import GalleryImage from '../src/models/gallery-image.model';

import {
  galleryImages,
  populateGalleryImages,
  deleteGalleryImages,
  copySeedImage
} from './seed/seed';

beforeEach(populateGalleryImages);

beforeAll(copySeedImage);

afterAll(deleteGalleryImages);

describe('/gallery', () => {
  describe('POST /gallery', () => {
    it('should upload new image', done => {
      const image = {
        title: 'Test image'
      };

      request(app)
        .post('/gallery')
        .field('title', image.title)
        .attach('image', './tests/seed/files/test1.png')
        .expect(200)
        .expect(res => {
          expect(res.body.image.title).toEqual(image.title);
          expect(res.body.image.filename).toMatch(
            /^image-[a-zA-Z0-9]{32}-[0-9]*\.(png|jpe?g|bmp)/
          );
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          GalleryImage.find(image)
            .then(images => {
              expect(images.length).toBe(1);
              expect(images[0].title).toEqual(image.title);
              expect(images[0].filename).toMatch(
                /^image-[a-zA-Z0-9]{32}-[0-9]*\.(png|jpe?g|bmp)/
              );
              if (fs.existsSync(`./public/img/gallery/${images[0].filename}`)) {
                done();
              } else {
                done(new Error('File does not exist'));
              }
            })
            .catch(e => done(e));
        });
    });
    it('should not upload text file', done => {
      const image = {
        title: 'wrong format'
      };

      request(app)
        .post('/gallery')
        .field('title', image.title)
        .attach('image', './tests/seed/files/test1.txt')
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          GalleryImage.find()
            .then(res => {
              expect(res.length).toBe(2);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('GET /gallery', () => {
    it('should return images', done => {
      request(app)
        .get('/gallery')
        .expect(200)
        .expect(res => {
          expect(res.body.images.length).toBe(2);
          done();
        })
        .catch(e => done(e));
    });
  });

  describe('GET /gallery/:id', () => {
    it('should return image by id', done => {
      request(app)
        .get(`/gallery/${galleryImages[0]._id.toHexString()}`)
        .expect(200)
        .expect(res => {
          expect(res.body.image.title).toBe(galleryImages[0].title);
          done();
        })
        .catch(e => done(e));
    });

    it('should return 404 if image not found', done => {
      const id = new ObjectID().toHexString();
      request(app)
        .get(`/gallery/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if id not valid', done => {
      const id = 123;
      request(app)
        .get(`/gallery/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('DELETE /gallery/:id', () => {
    it('should remove an image', done => {
      const id = galleryImages[1]._id.toHexString();

      request(app)
        .delete(`/gallery/${id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.image._id).toBe(id);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          GalleryImage.findById(id)
            .then(image => {
              expect(image).toBeFalsy();
              done();
            })
            .catch(e => done(e));
        });
    });

    it('should return 404 if image not found', done => {
      const id = new ObjectID().toHexString();
      request(app)
        .delete(`/gallery/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if id not valid', done => {
      const id = 123;
      request(app)
        .delete(`/gallery/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /gallery/:id', () => {
    it('should update an image with new data', done => {
      const id = galleryImages[0]._id.toHexString();
      const body = { title: 'New title' };

      request(app)
        .patch(`/gallery/${id}`)
        .send(body)
        .expect(200)
        .expect(res => {
          expect(res.body.image.title).toBe(body.title);
        })
        .end(done);
    });
  });
});
