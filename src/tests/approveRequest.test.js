import chaiHttp from 'chai-http';
import { use, request, should } from 'chai';
import app from '../app';
import {
  userfactory,
  hotelfactory,
  roomfactory
} from './scripts/factories';
import Hash from '../utils/hash';
import requestData from './mock-data/request';
import tripsData from './mock-data/trips-data';
import tokenizer from '../utils/jwt';
import truncate from './scripts/truncate';

should();
use(chaiHttp);

const PREFIX = '/api/v1';

describe('PATCH /Request/:ID appproved', () => {
  let token = '';
  let userToken = '';
  let requestId = '';
  let manager = '';
  before(async () => {
    await truncate();
    await roomfactory(tripsData.rooms[0]);
    await hotelfactory(tripsData.hotels[0]);
    manager = await userfactory(requestData.users[0]);
    const user = await userfactory({
      firstName: 'new',
      lastName: 'test',
      email: 'testnew@email.co',
      password: Hash.generateSync('bttj6bt'),
      lineManagerId: manager.id
    });
    token = await tokenizer.signToken({
      id: manager.id,
      email: 'testcase@email.co',
      role: 'manager'
    });
    userToken = await tokenizer.signToken(user);
  });

  before((done) => {
    request(app)
      .post(`${PREFIX}/trips/oneway`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(tripsData.trips[0])
      .end((err, res) => {
        requestId = res.body.data.id;
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
  it('Patch /requests/manager - Manager should not be able to update status twice', (done) => {
    request(app)
      .patch(`${PREFIX}/request/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'declined' })
      .end((err, res) => {
        res.status.should.be.equal(409);
        done();
      });
  });
  describe('Manager should not be able to access Requests that do not belong to him', () => {
    before(async () => {
      manager = await userfactory(requestData.users[3]);
      token = await tokenizer.signToken({
        id: manager.id,
        email: 'testcase@email.co',
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
