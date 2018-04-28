import request from 'supertest';
import app from '../src/app';

import { ObjectID } from 'mongodb';

import Member from '../src/models/member.model';

import { members, populateMembers } from './seed/seed';
beforeEach(populateMembers);

describe('/members', () => {
  describe('POST /members', () => {
    it('should add new member', done => {
      const memberInput = {
        firstName: 'James',
        lastName: 'Dean',
        bio: 'Test bio',
        avatar: 'https://google.com',
        order: 2,
        role: 'Guitar'
      };

      request(app)
        .post('/members')
        .send(memberInput)
        .expect(200)
        .expect(res => {
          expect(res.body.member).toMatchObject(memberInput);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          Member.findOne(memberInput)
            .then(member => {
              expect(member).toBeTruthy();
              expect(member).toMatchObject(memberInput);
              done();
            })
            .catch(e => done(e));
        });
    });

    it('should not add member with missing data', done => {
      const member = { bio: 'test bio' };

      request(app)
        .post('/members')
        .send(member)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Member.find()
            .then(members => {
              expect(members.length).toBe(2);
              done();
            })
            .catch(e => done(e));
        });
    });
  });

  describe('GET /members', () => {
    it('should return members', done => {
      request(app)
        .get('/members')
        .expect(200)
        .expect(res => {
          expect(res.body.members.length).toBe(2);
          done();
        })
        .catch(e => done(e));
    });
  });

  describe('GET /members/:id', () => {
    it('should return member by id', done => {
      const id = members[1]._id.toHexString();
      request(app)
        .get(`/members/${id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.member._id).toBe(id);
          done();
        })
        .catch(e => done(e));
    });

    it('should return 404 if member not found', done => {
      const id = new ObjectID().toHexString();

      request(app)
        .get(`/members/${id}`)
        .expect(404)
        .end(done);
    });
  });

  it('should return 404 if id not valid', done => {
    const id = '123asd';

    request(app)
      .get(`/members/${id}`)
      .expect(404)
      .end(done);
  });

  describe('DELETE /members/:id', () => {
    it('should remove a member', done => {
      const id = members[1]._id.toHexString();

      request(app)
        .delete(`/members/${id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.member._id).toBe(id);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Member.findById(id)
            .then(member => {
              expect(member).toBeFalsy();
              done();
            })
            .catch(e => done(e));
        });
    });

    it('should return 404 if member not found', done => {
      const id = new ObjectID().toHexString();

      request(app)
        .delete(`/members/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if id not valid', done => {
      const id = '123asd';

      request(app)
        .delete(`/members/${id}`)
        .expect(404)
        .end(done);
    });
  });

  describe('PATCH /members/:id', () => {
    it('should update a member with new data', done => {
      const id = members[0]._id.toHexString();
      const body = { bio: 'PATCH bio', order: 5 };

      request(app)
        .patch(`/members/${id}`)
        .send(body)
        .expect(200)
        .expect(res => {
          expect(res.body.member.bio).toBe(body.bio);
          expect(res.body.member.order).toBe(body.order);
        })
        .end(done);
    });
  });
});
