import chaiHttp from 'chai-http';
import { use, request, should } from 'chai';
import app from '../app';
import {
  userfactory,
  hotelfactory,
  roomfactory,
  locationfactory
} from './scripts/factories';
import requestData from './mock-data/request';
import tripsData from './mock-data/trips-data';
import tokenizer from '../utils/jwt';
import truncate from './scripts/truncate';

should();
use(chaiHttp);

const PREFIX = '/api/v1';

describe('PATCH /Request/:ID declined', () => {
  let token = '';
  let userToken = '';
  let requestId = '';
  before(async () => {
    await truncate();
    await locationfactory({ id: 1, city: 'Kigali', country: 'Rwanda' });
    await locationfactory({ id: 2, city: 'Nairobi', country: 'Kenya' });
    await hotelfactory(tripsData.hotels[0]);
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[1]);
    await userfactory(requestData.users[0]);
    await userfactory(requestData.users[1]);
    token = await tokenizer.signToken(requestData.users[0]);
    userToken = await tokenizer.signToken(requestData.users[1]);
  });

  before((done) => {
    request(app)
      .post(`${PREFIX}/trips/oneway`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(tripsData.trips[0])
      .end((err, res) => {
        requestId = res.body.data.request.id;
        res.status.should.be.eql(201);
        done(err);
      });
  });

  it('Patch /requests/manager - Manager should not be able to update status to any other than approve or reject', (done) => {
    request(app)
      .patch(`${PREFIX}/request/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'approv' })
      .end((err, res) => {
        res.status.should.be.equal(400);
        done();
      });
  });
  it('Patch /requests/manager - Manager should be able to update status to approved or declined successfully', (done) => {
    request(app)
      .patch(`${PREFIX}/request/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'approved' })
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal('Succesfully approved request');
        done();
      });
  });
  describe('Manager should not be able to access Requests that do not belong to him', () => {
    before(async () => {
      await truncate();
      await userfactory(requestData.users[4]);
      token = await tokenizer.signToken({
        email: 'testcase32@email.co',
        role: 'manager'
      });
    });
    it('Patch /request/:id - user should not be able to update request status that doesn\'t belong to him', (done) => {
      request(app)
        .patch(`${PREFIX}/request/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'approved' })
        .end((err, res) => {
          res.status.should.be.equal(403);
          done();
        });
    });
  });
});
