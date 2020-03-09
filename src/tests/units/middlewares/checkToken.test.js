import chai, { expect, assert } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import { EventEmitter } from 'events';
import httpMocks from 'node-mocks-http';
import { decodeQueryToken, verifyUser } from '../../../middlewares/checkToken';
import truncate from '../../scripts/truncate';

chai.use(chaiHttp);

describe('Unit tests for check token verification middleware', () => {
  before(async () => {
    await truncate();
  });

  it('check token if its valid', (done) => {
    const buildResponse = () => httpMocks.createResponse({ eventEmitter: EventEmitter });
    const response = buildResponse();
    const request = httpMocks.createRequest({
      method: '',
      url: '/api/v1',
      query: {
        token: 'noifhenuxrsd47893yt54tuogo'
      }
    });
    response.on('end', async () => {
      process.on('unhandledRejection', error => assert.fail('expected', 'actual', error.stack));
      // eslint-disable-next-line no-underscore-dangle
      expect(await response._getJSONData()).to.deep.equal({
        status: 'error',
        message: 'not authourized, Please try to regenerate another email'
      });
      return done();
    });
    decodeQueryToken(request, response);
  });
  it('check token if its valid', (done) => {
    const buildResponse = () => httpMocks.createResponse({ eventEmitter: EventEmitter });
    const response = buildResponse();
    const request = httpMocks.createRequest({
      method: '',
      url: '/api/v1',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ld2VtYUB0ZXN0LmNvbSIsInVzZXJJZCxI6MiwidmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE1NzQ3NDI2MjcsImV4cCI6MTU3NDgyOTAyN30.ua5rGAqZA_dy594_iHmLagbg6qRwx-k842oNuDUWsZc'
      }
    });
    response.on('end', async () => {
      process.on('unhandledRejection', error => assert.fail('expected', 'actual', error.stack));
      // eslint-disable-next-line no-underscore-dangle
      expect(await response._getJSONData()).to.deep.equal({
        status: 'error',
        message: 'Invalid token, please login'
      });
      return done();
    });
    verifyUser(request, response);
  });
});
