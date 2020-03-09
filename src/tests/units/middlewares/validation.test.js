import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import { EventEmitter } from 'events';
import httpMocks from 'node-mocks-http';
import { validation, validateMultiCity } from '../../../validation/validation';
import truncate from '../../scripts/truncate';

chai.use(chaiHttp);

describe('Unit tests for checking validations for trips', () => {
  before(async () => {
    await truncate();
  });

  it('Validation() middleware - should return error on undefined method', (done) => {
    const buildResponse = () => httpMocks.createResponse({ eventEmitter: EventEmitter });
    const response = buildResponse();
    const request = httpMocks.createRequest({
      method: 'get',
      url: '/api/v1/trips/oneway',
      route: '/trips/oneway',
      body: {}
    });
    response.on('end', async () => {
      process.on('unhandledRejection', error => assert.fail('expected', 'actual', error.stack));
      // eslint-disable-next-line no-underscore-dangle
      expect(await response.statusCode).eql(405);
      return done();
    });
    validation(request, response, done);
  });

  it('validateMultiCity() middleware - should return error on invalid data', (done) => {
    const buildResponse = () => httpMocks.createResponse({ eventEmitter: EventEmitter });
    const response = buildResponse();
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/v1/trips/multi-city',
      body: [{
        leavingFrom: 'Kigali',
        goingTo: 'Nairobi',
        travelDate: '2019-11-18',
        hotelId: 1,
        type: 'return',
        rooms: [3]
      }]
    });
    response.on('end', async () => {
      process.on('unhandledRejection', error => assert.fail('expected', 'actual', error.stack));
      // eslint-disable-next-line no-underscore-dangle
      expect(await response.statusCode).eql(400);
      return done();
    });
    validateMultiCity(request, response, done);
  });
});
