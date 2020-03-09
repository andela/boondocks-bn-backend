import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../app';
import userData from './mock-data/resetPasswordData';
import truncate from './scripts/truncate';
import db from '../models';
import jwt from '../utils/jwt';

chai.use(chaiHttp);
chai.should();
let tokenTest;

describe('Reset password', () => {
  describe('Forgot password endpoint', () => {
    before(async () => {
      await truncate();
      await db.user.create(userData.user);
    });

    it('send forgot password email successfully', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/forgotPassword')
        .send({ email: userData.validUser })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.message.should.equal('Successful reset password please check your email');
          if (err) return done(err);
          done();
        });
    });

    it('send forgot password email successfully', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/forgotPassword')
        .send({ email: userData.invalidUser })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.message.should.equal('User with such email does not exist');
          if (err) return done();
          done();
        });
    });
  });
  describe('reset and Update password', () => {
    beforeEach(async () => {
      await truncate();
      await db.user.create(userData.user);
      tokenTest = await jwt.signToken(userData.user1);
    });
    it('User should be able to reset and Update password successfully', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/auth/resetPassword?token=${tokenTest}`)
        .send({ password: userData.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.message.should.equal('Updated your password successful');
          if (err) return done(err);
          done();
        });
    });
    it('User should not be able to update invalid password', (done) => {
      chai
        .request(app)
        .patch(`/api/v1/auth/resetPassword?token=${tokenTest}`)
        .send({ password: userData.password1 })
        .end((err, res) => {
          res.should.have.status(400);
          if (err) return done(err);
          done();
        });
    });
  });
});
