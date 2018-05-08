import request from 'supertest';
import app from '../src/app';
import { Request, Response } from 'express';

import { ObjectID } from 'mongodb';

import User from '../src/models/user.model';

import { users, populateUsers } from './seed/seed';
beforeEach(populateUsers);
describe('/users', () => {
  describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
      request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect(res => {
          expect(res.body._id).toBe(users[0]._id.toHexString());
          expect(res.body.email).toBe(users[0].email);
          expect(res.body.username).toBe(users[0].username);
        })
        .end(done);
    });

    it('should return a 401 if not authenticated', done => {
      request(app)
        .get('/users/me')
        .expect(401)
        .expect(res => {
          expect(res.body).toEqual({});
        })
        .end(done);
    });
  });

  describe('POST /users', () => {
    it('should create a user', done => {
      const email = 'example@example.com';
      const password = '123mnb!';
      const username = 'username1';

      request(app)
        .post('/users')
        .send({ email, password, username })
        .expect(200)
        .expect(res => {
          expect(res.headers['x-auth']).toBeTruthy();
          expect(res.body._id).toBeTruthy();
          expect(res.body.email).toBe(email);
          expect(res.body.username).toBe(username);
        })
        .end(err => {
          if (err) {
            return done(err);
          }

          User.findOne({ username })
            .then(user => {
              expect(user).toBeTruthy();
              expect(user.password).not.toBe(password);
              done();
            })
            .catch(e => done(e));
        });
    });

    it('should return validation errors if request is invalid', done => {
      const email = 'asd';
      const password = 'asd';
      const username = 'asd';

      request(app)
        .post('/users')
        .send({ email, password, username })
        .expect(400)
        .end(done);
    });
    it('should not create user if email in use', done => {
      const email = users[0].email;
      const password = '123mnb!';
      const username = 'username1';

      request(app)
        .post('/users')
        .send({ email, password, username })
        .expect(400)
        .end(done);
    });
  });

  describe('POST /users/login', () => {
    it('should login user and return auth token', done => {
      request(app)
        .post('/users/login')
        .send({ username: users[1].username, password: users[1].password })
        .expect(200)
        .expect(res => {
          expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
          if (err) {
            done(err);
          }

          User.findById({ _id: users[1]._id })
            .then(user => {
              expect(user.toObject().tokens[1]).toMatchObject({
                access: 'auth',
                token: res.get('x-auth')
              });
              done();
            })
            .catch(e => done(e));
        });
    });
    it('should reject invalid login', done => {
      request(app)
        .post('/users/login')
        .send({
          username: users[1].username,
          password: users[1].password + '1'
        })
        .expect(400)
        .expect(res => {
          expect(res.headers['x-auth']).toBeFalsy();
        })
        .end((err, res) => {
          if (err) {
            done(err);
          }

          User.findById({ _id: users[1]._id })
            .then(user => {
              expect(user.tokens.length).toBe(1);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', done => {
      request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          User.findById(users[0]._id)
            .then(user => {
              expect(user.tokens.length).toBe(0);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('PATCH /users/me', () => {
    it('should update user data', done => {
      const email = 'patch@example.com';

      request(app)
        .patch('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .send({ email })
        .expect(200)
        .expect(res => {
          expect(res.body.email).toBe(email);
        })
        .end(err => {
          if (err) {
            return done(err);
          }

          User.findOne({ email })
            .then(user => {
              expect(user).toBeTruthy();
              expect(user.email).toBe(email);
              done();
            })
            .catch(e => done(e));
        });
    });
  });
});
