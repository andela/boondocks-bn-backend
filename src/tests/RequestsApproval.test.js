import chaiHttp from 'chai-http';
import { use, request, should } from 'chai';
import app from '../app';
import {
  userfactory, roomfactory
} from './scripts/factories';
import Hash from '../utils/hash';
import requestData from './mock-data/request';
import tripsData from './mock-data/trips-data';
import tokenizer from '../utils/jwt';
import truncate from './scripts/truncate';
import db from '../models';

should();
use(chaiHttp);

const prefix = '/api/v1';

describe('/Requests/manager', () => {
  let token = '';
  let userToken = '';
  before(async () => {
    await db.like.destroy({ where: {}, force: true });
    await truncate();
    await roomfactory(tripsData.rooms[0]);
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
        res.status.should.be.eql(201);
        done(err);
      });
  });

  it('Get /requests/manager - Manager should be able to get "open" requests from direct report users', (done) => {
    request(app)
      .get(`${prefix}/requests/manager`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.equal('Successfully fetched the requests');
        done();
      });
  });
  it('Get /requests/manager - user should not be able to get "open" requests from direct report users', (done) => {
    request(app)
      .get(`${prefix}/requests/manager`)
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        res.status.should.be.equal(403);
        res.body.message.should.equal('insufficient privileges');
        done();
      });
  });
  describe('Not found request for the manager', () => {
    before(async () => {
      await truncate();
      const manager = await userfactory(requestData.users[0]);
      token = await tokenizer.signToken({
        id: manager.id,
        email: 'testcase@email.co',
        role: 'manager'
      });
    });
    it('Get /requests/manager - user should not be able to get "open" requests from direct report users', (done) => {
      request(app)
        .get(`${prefix}/requests/manager`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.status.should.be.equal(404);
          done();
        });
    });
  });
});
