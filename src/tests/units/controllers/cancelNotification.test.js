import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import { EventEmitter } from 'events';
import httpMocks from 'node-mocks-http';
import notificationContoller from '../../../controllers/notification.controller';
import userData from '../../mock-data/verification.data';
import truncate from '../../scripts/truncate';
import db from '../../../models';

chai.use(chaiHttp);

describe('Unit tests for user opt-out of email notification', () => {
  describe('notification email', () => {
    before(async () => {
      await truncate();
      await db.user.create(userData.user4);
      await db.user.create(userData.user5);
    });

    it('opting out a user of receiving trip request notification', (done) => {
      const buildResponse = () => httpMocks.createResponse({ eventEmitter: EventEmitter });
      const response = buildResponse();
      const request = httpMocks.createRequest({
        method: 'PATCH',
        url: '/api/v1/notification/stopNotification',
      });
      response.locals.user = userData.user4;
      response.on('end', async () => {
        process.on('unhandledRejection', error => assert.fail('expected', 'actual', error.stack));
        // eslint-disable-next-line no-underscore-dangle
        expect(await response._getJSONData()).to.deep.equal({
          status: 'success',
          message: 'Receiving notification cancelled'
        });
        return done();
      });
      notificationContoller.cancelNotification(request, response);
    });
    it('check if user had opted out before', (done) => {
      const buildResponse = () => httpMocks.createResponse({ eventEmitter: EventEmitter });
      const response = buildResponse();
      const request = httpMocks.createRequest({
        method: 'PATCH',
        url: '/api/v1/notification/stopNotification',
      });
      response.locals.user = userData.user5;
      response.on('end', async () => {
        process.on('unhandledRejection', error => assert.fail('expected', 'actual', error.stack));
        // eslint-disable-next-line no-underscore-dangle
        expect(await response._getJSONData()).to.deep.equal({
          status: 'success',
          message: 'You already unsubscribed from emails'
        });
        return done();
      });
      notificationContoller.cancelNotification(request, response);
    });
  });
});
