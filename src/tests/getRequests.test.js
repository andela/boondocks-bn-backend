import chaiHttp from 'chai-http';
import { use, request, should } from 'chai';
import app from '../app';
import {
  userfactory,
  hotelfactory,
  roomfactory
} from './scripts/factories';
import tripsData from './mock-data/trips-data';
import Hash from '../utils/hash';
import tokenizer from '../utils/jwt';
import truncate from './scripts/truncate';
import requestData from './mock-data/request';

should();
use(chaiHttp);

const prefix = '/api/v1';

describe('/Requests', () => {
  let token = '';
  let requestid = '';
  let manager = '';
  before(async () => {
    await truncate();
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[1]);
    await hotelfactory(tripsData.hotels[0]);
    await userfactory(requestData.users[0]);
    manager = await userfactory(requestData.users[1]);
    await userfactory({
      firstName: 'John',
      lastName: 'McCain',
      password: Hash.generateSync('1234567e'),
      email: 'john@mccain.com',
      lineManagerId: manager.id
    });
    token = await tokenizer.signToken({
      id: 1,
      email: 'john@mccain.com',
      isVerified: 1
    });
  });

  before((done) => {
    request(app)
      .post(`${prefix}/trips/oneway`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.trips[0])
      .end((err, res) => {
        requestid = res.body.data.id;
        done(err);
      });
  });

  it('GET /request - user should be able to get all his/her requests', (done) => {
    request(app)
      .get(`${prefix}/requests`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.equal('Successfully fetched the requests');
        done();
      });
  });
  it('POST /requests/:id - user should be able to get a single request', (done) => {
    request(app)
      .get(`${prefix}/requests/${requestid}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.equal('Successfully fetched the requests');
        done();
      });
  });
  it('POST /request - user not provided token should not be able to fetch requests', (done) => {
    request(app)
      .get(`${prefix}/requests/${requestid}`)
      .end((err, res) => {
        res.status.should.be.equal(401);
        res.body.message.should.equal('Token not provided');
        done();
      });
  });
  it('POST /request - user should be able to get a single request', (done) => {
    request(app)
      .get(`${prefix}/requests/${requestid}`)
      .set('Authorization', 'Bearer fdgjhyufgrtyh63272')
      .end((err, res) => {
        res.status.should.be.equal(401);
        res.body.message.should.equal('Invalid token, please login');
        done();
      });
  });
  it('POST /request?query - user should be able to get all request with status open', (done) => {
    request(app)
      .get(`${prefix}/requests?status=open`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.equal('successfully fetched the requests');
        done();
      });
  });
  it('POST /request?query - user should not be able to get all request with status unknown', (done) => {
    request(app)
      .get(`${prefix}/requests?status=new`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.equal(400);
        res.body.message.should.equal('wrong request status');
        done();
      });
  });

  describe('Requests not found', () => {
    beforeEach(async () => {
      truncate();
      await userfactory({
        firstName: 'John',
        lastName: 'McCain',
        password: Hash.generateSync('1234567e'),
        email: 'john@mccain.com'
      });
      token = await tokenizer.signToken({
        id: 1,
        email: 'john@mccain.com',
        isVerified: 1
      });
    });

    it('POST /request - user should not be able to get a single request that doesn\'t exist', (done) => {
      request(app)
        .get(`${prefix}/requests/342342`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.status.should.be.equal(404);
          res.body.message.should.equal('No Requests found with such id');
          done();
        });
    });

    it('POST /request - user should not be able to get requests when no requests created by him', (done) => {
      request(app)
        .get(`${prefix}/requests`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.status.should.be.equal(404);
          res.body.message.should.equal('No Requests found');
          done();
        });
    });
    it('POST /request?query - user should not be able to get requests with status open that haven\'t been created ', (done) => {
      request(app)
        .get(`${prefix}/requests?status=open`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.status.should.be.equal(404);
          res.body.message.should.equal('No Requests found');
          done();
        });
    });
  });
});
