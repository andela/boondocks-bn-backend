import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import { EventEmitter } from 'events';
import httpMocks from 'node-mocks-http';
import userData from '../../mock-data/resetPasswordData';
import userController from '../../../controllers/users.controller';
import truncate from '../../scripts/truncate';
import db from '../../../models';

chai.use(chaiHttp);

describe('Unit tests for reset password controller', () => {
  describe('Forgot password endpoint unit tests', () => {
    before(async () => {
      await truncate();
      await db.user.create(userData.user);
    });

    it('send forgot password email successfully unittest', (done) => {
      const buildResponse = () => httpMocks.createResponse({ eventEmitter: EventEmitter });
      const response = buildResponse();
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/api/v1/auth/forgotPassword',
        body: {
          email: userData.validUser
        }
      });
      response.on('end', async () => {
        process.on('unhandledRejection', error => assert.fail('expected', 'actual', error.stack));
        // eslint-disable-next-line no-underscore-dangle
        expect(await response._getJSONData()).to.deep.equal({
          status: 'success',
          message: 'Successful reset password please check your email'
        });
        return done();
      });
      userController.forgotPassword(request, response);
    });

    it('Should not verify twice', (done) => {
      const buildResponse = () => httpMocks.createResponse({ eventEmitter: EventEmitter });
      const response = buildResponse();
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/api/v1/auth/verification',
        body: {
          email: userData.invalidUser
        }
      });
      response.on('end', async () => {
        process.on('unhandledRejection', error => assert.fail('expected', 'actual', error.stack));
        // eslint-disable-next-line no-underscore-dangle
        expect(await response._getJSONData()).to.deep.equal({
          status: 'error',
          message: 'User with such email does not exist'
        });
        return done();
      });
      userController.forgotPassword(request, response);
    });
  });

  describe('reset and Update password unit tests', () => {
    beforeEach(async () => {
      await db.like.destroy({ where: {}, force: true });
      await truncate();
      await db.user.create(userData.user);
    });

    it('User should be able to reset and Update password successfully controller', (done) => {
      const buildResponse = () => httpMocks.createResponse({ eventEmitter: EventEmitter });
      const response = buildResponse();
      const request = httpMocks.createRequest({
        method: 'PATCH',
        url: '/api/v1/auth/resetPassword',
        body: {
          password: 'jgoeiwh6rty476gt'
        }
      });
      response.locals.user = userData.user;
      response.on('end', async () => {
        process.on('unhandledRejection', error => assert.fail('expected', 'actual', error));
        // eslint-disable-next-line no-underscore-dangle
        expect(await response._getJSONData()).to.deep.equal({
          status: 'success',
          message: 'Updated your password successful'
        });
        return done();
      });
      userController.resetPassword(request, response);
    });

    it('User should be able to reset and Update password successfully controller', (done) => {
      const buildResponse = () => httpMocks.createResponse({ eventEmitter: EventEmitter });
      const response = buildResponse();
      const request = httpMocks.createRequest({
        method: 'PATCH',
        url: '/api/v1/auth/resetPassword',
        body: {
          password: 'jgoeiwh6rty476gt'
        }
      });
      response.on('end', async () => {
        process.on('unhandledRejection', error => assert.fail('expected', 'actual', error));
        // eslint-disable-next-line no-underscore-dangle
        expect(await response._getJSONData()).to.deep.equal({
          status: 'error',
          message: 'User does not exist, Please register'
        });
        return done();
      });
      userController.resetPassword(request, response);
    });
  });
});
