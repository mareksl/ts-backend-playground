import request from 'supertest';
import app from '../src/app';

import { ObjectID } from 'mongodb';

import Event from '../src/models/event.model';

import { events, populateEvents, users, populateUsers } from './seed/seed';
beforeEach(populateUsers);
beforeEach(populateEvents);

describe('/events', () => {
  describe('POST /events', () => {
    it('should add new event', done => {
      const event = {
        location: 'Warszawa',
        date: 123,
        description: 'Description',
        link: 'https://google.com'
      };
      request(app)
        .post('/events')
        .set('x-auth', users[0].tokens[0].token)
        .send(event)
        .expect(200)
        .expect(res => {
          expect(res.body.event.location).toEqual(event.location);
          expect(res.body.event.date).toEqual(event.date);
          expect(res.body.event.description).toEqual(event.description);
          expect(res.body.event.link).toEqual(event.link);
        })
        .end((err, res) => {
          Event.find(event)
            .then(events => {
              if (err) {
                return done(err);
              }
              expect(events.length).toBe(1);
              expect(events[0].location).toEqual(event.location);
              expect(events[0].date).toEqual(event.date);
              expect(events[0].description).toEqual(event.description);
              expect(events[0].link).toEqual(event.link);
              done();
            })
            .catch(e => done(e));
        });
    });

    it('should not add event with invalid data', done => {
      const event = {
        location: 'Warszawa',
        date: 123,
        description: 'Description',
        link: 'something'
      };
      request(app)
        .post('/events')
        .set('x-auth', users[0].tokens[0].token)
        .send(event)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Event.find()
            .then(res => {
              expect(res.length).toBe(2);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('GET /events', () => {
    it('should return events', done => {
      request(app)
        .get('/events')
        .expect(200)
        .expect(res => {
          expect(res.body.events.length).toBe(2);
          done();
        })
        .catch(e => done(e));
    });
  });

  describe('GET /events/:id', () => {
    it('should return event by id', done => {
      request(app)
        .get(`/events/${events[0]._id.toHexString()}`)
        .expect(200)
        .expect(res => {
          expect(res.body.event.location).toBe(events[0].location);
          done();
        })
        .catch(e => done(e));
    });

    it('should return 404 if event not found', done => {
      const id = new ObjectID().toHexString();
      request(app)
        .get(`/events/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if id not valid', done => {
      const id = 123;
      request(app)
        .get(`/events/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('DELETE /events/:id', () => {
    it('should remove an event', done => {
      const id = events[1]._id.toHexString();

      request(app)
        .delete(`/events/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body.event._id).toBe(id);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Event.findById(id)
            .then(event => {
              expect(event).toBeFalsy();
              done();
            })
            .catch(e => done(e));
        });
    });

    it('should return 404 if event not found', done => {
      const id = new ObjectID().toHexString();
      request(app)
        .delete(`/events/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if id not valid', done => {
      const id = 123;
      request(app)
        .delete(`/events/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /events/:id', () => {
    it('should update an event with new data', done => {
      const id = events[0]._id.toHexString();
      const body = { location: 'New York', date: 789 };

      request(app)
        .patch(`/events/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .send(body)
        .expect(200)
        .expect(res => {
          expect(res.body.event.location).toBe(body.location);
          expect(res.body.event.date).toBe(body.date);
        })
        .end(done);
    });
  });
});
