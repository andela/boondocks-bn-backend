/* eslint-disable object-curly-newline */
import chaiHttp from 'chai-http';
import { expect, request, should, use } from 'chai';
import app from '../app';
import tokenizer from '../utils/jwt';
import db from '../models';
import testUsers from './mock-data/test-users';

should();
use(chaiHttp);

describe('User profile', () => {
  const prefix = '/api/v1';
  let token,
    userId,
    managerId,
    invalidManagerId,
    userDetails,
    userDetailsOwnManage,
    userDetailsInvalidLineManager,
    userDetailsUnexistingLineManager;

  before(async () => {
    await db.user.destroy({
      where: {},
      force: true
    });
    const user = (await db.user.create(testUsers[0])).dataValues;
    const manager = (await db.user.create(testUsers[1])).dataValues;
    const invalidManager = (await db.user.create(testUsers[4])).dataValues;
    userId = user.id;
    managerId = manager.id;
    invalidManagerId = invalidManager.id;
    await db.user.update({ role: 'manager' }, { where: { id: managerId } });

    token = await tokenizer.signToken({
      userId,
      email: 'john@barefoot.com',
      isVerified: true
    });

    token = `Bearer ${token}`;

    userDetails = {
      firstName: 'Johnny',
      lastName: 'Doey',
      password: 'newPassword8',
      email: 'john@barefoot.com',
      phoneNumber: '000-000-0012',
      lineManagerId: managerId,
      gender: 'male',
      preferredLanguage: 'english',
      preferredCurrency: '$',
      department: 'IT',
      birthDate: '1950-01-01T00:00:00.000Z',
      residenceAddress: 'Kigali, Rwanda'
    };

    userDetailsOwnManage = {
      firstName: 'Johnny',
      lastName: 'Doey',
      password: 'newPassword8',
      email: 'john@barefoot.com',
      phoneNumber: '000-000-0012',
      lineManagerId: userId,
      gender: 'male',
      preferredLanguage: 'english',
      preferredCurrency: '$',
      department: 'IT',
      birthDate: '1950-01-01T00:00:00.000Z',
      residenceAddress: 'Kigali, Rwanda'
    };

    userDetailsInvalidLineManager = {
      firstName: 'Johnny',
      lastName: 'Doey',
      password: 'newPassword8',
      email: 'john@barefoot.com',
      phoneNumber: '000-000-0012',
      lineManagerId: invalidManagerId,
      gender: 'male',
      preferredLanguage: 'english',
      preferredCurrency: '$',
      department: 'IT',
      birthDate: '1950-01-01T00:00:00.000Z',
      residenceAddress: 'Kigali, Rwanda'
    };

    userDetailsUnexistingLineManager = {
      firstName: 'Johnny',
      lastName: 'Doey',
      password: 'newPassword8',
      email: 'john@barefoot.com',
      phoneNumber: '000-000-0012',
      lineManagerId: 2000,
      gender: 'male',
      preferredLanguage: 'english',
      preferredCurrency: '$',
      department: 'IT',
      birthDate: '1950-01-01T00:00:00.000Z',
      residenceAddress: 'Kigali, Rwanda'
    };
  });

  describe('/PATCH api/v1/user/update-profile', () => {
    it('it should return a 201 response upon authorization', (done) => {
      request(app)
        .patch(`${prefix}/user/update-profile`)
        .set('Authorization', token)
        .send(userDetails)
        .end((_err, res) => {
          expect(res.status)
            .eql(201);
          done();
        });
    });


    it('it should return a 409 response when he sets him as own lineManager', (done) => {
      request(app)
        .patch(`${prefix}/user/update-profile`)
        .set('Authorization', token)
        .send(userDetailsOwnManage)
        .end((_err, res) => {
          expect(res.status)
            .eql(409);
          done();
        });
    });

    it('it should return a 409 response by setting a LineManager with no "manager" role', (done) => {
      request(app)
        .patch(`${prefix}/user/update-profile`)
        .set('Authorization', token)
        .send(userDetailsInvalidLineManager)
        .end((_err, res) => {
          expect(res.status)
            .eql(409);
          done();
        });
    });

    it('it should return a 409 response by setting a LineManager with unexisting user', (done) => {
      request(app)
        .patch(`${prefix}/user/update-profile`)
        .set('Authorization', token)
        .send(userDetailsUnexistingLineManager)
        .end((_err, res) => {
          expect(res.status)
            .eql(409);
          done();
        });
    });

    it('it should return a 401 response without authorization', (done) => {
      request(app)
        .patch(`${prefix}/user/update-profile`)
        .send(userDetails)
        .end((_err, res) => {
          expect(res.status)
            .eql(401);
          done();
        });
    });

    it('it should return error for an invalid token', (done) => {
      const invalidToken = 'Bearer eyJhbGciOib20iLCJpYXQiOjE1NjgzOTA3gJ8KbmH4eJwNQiAHdYH-wlyU';
      request(app)
        .patch(`${prefix}/user/update-profile`)
        .set('Authorization', invalidToken)
        .send(userDetails)
        .end((err, res) => {
          expect(res.status)
            .eql(401);
          done();
        });
    });
  });

  describe('/GET api/v1/user/:userId', () => {
    it('it should return a 200 response upon authorization', (done) => {
      request(app)
        .get(`${prefix}/user/${userId}`)
        .set('Authorization', token)
        .end((_err, res) => {
          expect(res.status)
            .eql(200);
          done();
        });
    });

    it('it should return a 404 response when the user was not found', (done) => {
      request(app)
        .get(`${prefix}/user/2000`)
        .set('Authorization', token)
        .end((_err, res) => {
          expect(res.status)
            .eql(404);
          done();
        });
    });

    it('it should return a 422 response if the userId is invalid', (done) => {
      request(app)
        .get(`${prefix}/user/ERRONOUS**ID`)
        .set('Authorization', token)
        .end((_err, res) => {
          expect(res.status)
            .eql(422);
          done();
        });
    });

    it('it should return a 401 response without authorization', (done) => {
      request(app)
        .get(`${prefix}/user/${userId}`)
        .end((_err, res) => {
          expect(res.status)
            .eql(401);
          done();
        });
    });

    it('it should return error for an invalid token', (done) => {
      const invalidToken = 'Bearer eyJhbGciOib20iLCJpYXQiOjE1NjgzOTA3gJ8KbmH4eJwNQiAHdYH-wlyU';
      request(app)
        .get(`${prefix}/user/${userId}`)
        .set('Authorization', invalidToken)
        .end((err, res) => {
          expect(res.status)
            .eql(401);
          done();
        });
    });
  });
});
