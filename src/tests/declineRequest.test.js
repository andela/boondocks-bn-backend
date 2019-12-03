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

const prefix = '/api/v1';

describe('PATCH /Request/:ID declined', () => {
  let token = '';
  let userToken = '';
  let requestId = '';
  before(async () => {
    await truncate();
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[1]);
    await hotelfactory(tripsData.hotels[0]);
    const manager = await userfactory(requestData.users[0]);
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
      .post(`${prefix}/trips/oneway`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(tripsData.trips[0])
      .end((err, res) => {
        requestId = res.body.data.id;
        res.status.should.be.eql(201);
        done(err);
      });
  });

  it('Patch /requests/manager - Manager should be able to update status to any other than approve or reject', (done) => {
    request(app)
      .patch(`${prefix}/request/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'declin' })
      .end((err, res) => {
        res.status.should.be.equal(400);
        done();
      });
  });
  it('Patch /requests/manager - Manager should be able to update status to declined successfully', (done) => {
    request(app)
      .patch(`${prefix}/request/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'declined' })
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal('Succesfully declined request');
        done();
      });
  });
  it('Patch /requests/manager - Manager should not be able to update status twice', (done) => {
    request(app)
      .patch(`${prefix}/request/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'approved' })
      .end((err, res) => {
        res.status.should.be.equal(409);
        done();
      });
  });
  describe('No access to the', () => {
    before(async () => {
      await truncate();
      const manager = await userfactory(requestData.users[0]);
      token = await tokenizer.signToken({
        id: manager.id,
        email: 'testcase@email.co',
        role: 'manager'
      });
    });
    it('Patch /request/:id - user should not be able to update request status that doesn\'t belong to him', (done) => {
      request(app)
        .patch(`${prefix}/request/1`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'declined' })
        .end((err, res) => {
          res.status.should.be.equal(403);
          done();
        });
    });
  });
});
