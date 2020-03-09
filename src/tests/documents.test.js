import { use, request, expect, should } from 'chai';
import chaiHttp from 'chai-http';
import { resolve } from 'path';
import app from '../app';
import tokenizer from '../utils/jwt';
import db from '../models';
import truncate from './scripts/truncate';

should();
use(chaiHttp);
let user, user2, user3, token, token2, token3;
describe('Travel documents', () => {
  const prefix = '/api/v1';

  before(async () => {
    await truncate();

    user = await db.user.create({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      password: '12345678',
      email: 'john@barefoot.com',
      role: 'requester',
    });
    user2 = await db.user.create({
      id: 2,
      firstName: 'John',
      lastName: 'Doe',
      password: '12345678',
      email: 'johndoe@barefoot.com',
      role: 'requester',
    });

    user3 = await db.user.create({
      id: 3,
      firstName: 'John',
      lastName: 'Doe',
      password: '12345678',
      email: 'johndoee@barefoot.com',
      role: 'travel_administrator',
    });

    await db.document.create({
      id: 100,
      name: 'VISA',
      url: 'https://boondocks-bn-images.s3.us-east-2.amazonaws.com/test/test-doc.jpeg',
      userId: 1,
      travelAdminId: 1,
      verified: true,
    });

    await db.document.create({
      id: 102,
      name: 'VISA',
      url: 'google.png',
      userId: 1,
      travelAdminId: 1,
      verified: true,
    });

    token = await tokenizer.signToken({
      id: user.id,
      firstName: 'John',
      lastName: 'Doe',
      email: user.email,
      isVerified: true,
    });
    token2 = await tokenizer.signToken({
      id: user2.id,
      firstName: 'John',
      lastName: 'Doe',
      email: user2.email,
      isVerified: true,
    });

    token3 = await tokenizer.signToken({
      id: user3.id,
      firstName: 'John',
      lastName: 'Doe',
      email: user3.email,
      isVerified: true,
    });
  });

  describe('Travel Documents', () => {
    it('POST /users/documents should allow the user to upload documents', (done) => {
      request(app)
        .post(`${prefix}/users/documents`)
        .set('Authorization', `Bearer ${token}`)
        .field('name', 'VISA')
        .attach('document', resolve(__dirname, 'mock-data/images/search.png'))
        .end((err, res) => {
          res.status.should.be.eql(201);
          const { data } = res.body;
          data.should.be.an('object');
          done();
        });
    });

    it('POST /users/documents should not save document if no file uploaded', (done) => {
      request(app)
        .post(`${prefix}/users/documents`)
        .set('Authorization', `Bearer ${token}`)
        .field('name', 'VISA')
        .end((err, res) => {
          expect(res.status).to.eql(400);
          done();
        });
    });
    it('GET /users/documents should allow the user to retrieve documents', (done) => {
      request(app)
        .get(`${prefix}/users/documents`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status)
            .eql(200);
          done(err);
        });
    });

    it('GET /users/documents should allow travel admin to retrieve documents', (done) => {
      request(app)
        .get(`${prefix}/users/documents`)
        .set('Authorization', `Bearer ${token3}`)
        .end((err, res) => {
          expect(res.status)
            .eql(200);
          done(err);
        });
    });

    it('GET /users/documents should allow suppliers to retrieve documents', (done) => {
      request(app)
        .get(`${prefix}/users/documents`)
        .set('Authorization', `Bearer ${token3}`)
        .end((err, res) => {
          expect(res.status)
            .eql(200);
          done(err);
        });
    });

    it('GET /documents/:id/download Download a documents', (done) => {
      request(app)
        .get(`${prefix}/documents/100/download`)
        .end((err, res) => {
          expect(res.status)
            .eql(200);
          done(err);
        });
    });

    it('GET /documents/:id/download should throw an error when trying to download invalid file', (done) => {
      request(app)
        .get(`${prefix}/documents/102/download`)
        .end((err, res) => {
          expect(res.status)
            .eql(500);
          done(err);
        });
    });

    it('DELETE /users/documents/:id Only the owner can delete a documents', (done) => {
      request(app)
        .delete(`${prefix}/users/documents/100`)
        .set('Authorization', `Bearer ${token2}`)
        .end((err, res) => {
          expect(res.status)
            .eql(409);
          done(err);
        });
    });

    it('DELETE /users/documents/:id delete a documents', (done) => {
      request(app)
        .delete(`${prefix}/users/documents/100`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status)
            .eql(200);
          done(err);
        });
    });


    it('PATCH /documents/:id/verify Verify a documents', (done) => {
      request(app)
        .patch(`${prefix}/documents/2/verify`)
        .set('Authorization', `Bearer ${token3}`)
        .end((err, res) => {
          expect(res.status)
            .eql(200);
          done(err);
        });
    });
  });
});
