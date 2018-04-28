import request from 'supertest';
import app from '../src/app';

import { ObjectID } from 'mongodb';

import Contact from '../src/models/contact.model';

import { contacts, populateContacts } from './seed/seed';
beforeEach(populateContacts);

describe('/contacts', () => {
  describe('POST /contacts', () => {
    it('should add new person contact', done => {
      const contactInput = {
        type: 'person',
        firstName: 'James',
        lastName: 'Dean',
        title: 'Manager',
        email: 'james@example.com',
        phone: '123 456 789',
        link: 'https://james.example.com'
      };

      request(app)
        .post('/contacts')
        .send(contactInput)
        .expect(200)
        .expect(res => {
          expect(res.body.contact).toMatchObject(contactInput);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Contact.findOne(contactInput)
            .then(contact => {
              expect(contact).toBeTruthy();
              expect(contact).toMatchObject(contactInput);
              done();
            })
            .catch(e => done(e));
        });
    });

    it('should add new general contact', done => {
      const contactInput = {
        type: 'general',
        title: 'Office',
        email: 'office@example.com'
      };

      request(app)
        .post('/contacts')
        .send(contactInput)
        .expect(200)
        .expect(res => {
          expect(res.body.contact).toMatchObject(contactInput);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Contact.findOne(contactInput)
            .then(contact => {
              expect(contact).toBeTruthy();
              expect(contact).toMatchObject(contactInput);
              done();
            })
            .catch(e => done(e));
        });
    });

    it('should not add contact with missing data', done => {
      const contact = { type: 'person' };

      request(app)
        .post('/contacts')
        .send(contact)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Contact.find()
            .then(contacts => {
              expect(contacts.length).toBe(2);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('GET /contacts', () => {
    it('should return contacts', done => {
      request(app)
        .get('/contacts')
        .expect(200)
        .expect(res => {
          expect(res.body.contacts.length).toBe(2);
          done();
        })
        .catch(e => done(e));
    });
  });

  describe('GET /contacts/:id', () => {
    it('should return contact by id', done => {
      const id = contacts[1]._id.toHexString();
      request(app)
        .get(`/contacts/${id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.contact._id).toBe(id);
          done();
        })
        .catch(e => done(e));
    });

    it('should return 404 if contact not found', done => {
      const id = new ObjectID().toHexString();

      request(app)
        .get(`/contacts/${id}`)
        .expect(404)
        .end(done);
    });
  });

  it('should return 404 if id not valid', done => {
    const id = '123asd';

    request(app)
      .get(`/contacts/${id}`)
      .expect(404)
      .end(done);
  });

  describe('DELETE /contacts/:id', () => {
    it('should remove a contact', done => {
      const id = contacts[1]._id.toHexString();

      request(app)
        .delete(`/contacts/${id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.contact._id).toBe(id);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Contact.findById(id)
            .then(contact => {
              expect(contact).toBeFalsy();
              done();
            })
            .catch(e => done(e));
        });
    });

    it('should return 404 if contact not found', done => {
      const id = new ObjectID().toHexString();

      request(app)
        .delete(`/contacts/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if id not valid', done => {
      const id = '123asd';

      request(app)
        .delete(`/contacts/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /contacts/:id', () => {
    it('should update a contact with new data', done => {
      const id = contacts[0]._id.toHexString();
      const body = { title: 'PATCH', firstName: 'Johnny' };

      request(app)
        .patch(`/contacts/${id}`)
        .send(body)
        .expect(200)
        .expect(res => {
          expect(res.body.contact.title).toBe(body.title);
          expect(res.body.contact.firstName).toBe(body.firstName);
        })
        .end(done);
    });
  });
});
