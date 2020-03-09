import chaiHttp from 'chai-http';
import { use, request, expect } from 'chai';
import app from '../app';
import db from '../models';
import testUsers from './mock-data/test-users';

use(chaiHttp);

const prefix = '/api/v1';
describe('/auth/signup', () => {
  beforeEach(async () => {
    await db.user.destroy({ where: {}, force: true });
    await db.user.create(testUsers[0]);
  });

  it('should be able to create a new  user', (done) => {
    request(app)
      .post(`${prefix}/auth/signup`)
      .send(testUsers[1]).end((err, res) => {
        expect(res.status).eql(201);
        done();
      });
  });

  it('should not create a new user when the email exists in the database', (done) => {
    request(app)
      .post(`${prefix}/auth/signup`)
      .send(testUsers[0])
      .end((err, res) => {
        expect(res.status).eql(409);
        done();
      });
  });

  it('should not create user when required field is missing e.g. firstName', (done) => {
    request(app)
      .post(`${prefix}/auth/signup`)
      .send(testUsers[2])
      .end((err, res) => {
        expect(res.status).eql(400);
        done();
      });
  });

  it('should not create user with invalid email', (done) => {
    request(app)
      .post(`${prefix}/auth/signup`)
      .send(testUsers[3])
      .end((err, res) => {
        expect(res.status).eql(400);
        done();
      });
  });
});
