import chaiHttp from 'chai-http';
import { use, request, should } from 'chai';
import app from '../app';
import db from '../models';
import tripsData from './mock-data/trips-data';
import Hash from '../utils/hash';
import tokenizer from '../utils/jwt';
import { roomfactory, requestfactory, userfactory } from './scripts/factories';
import requestData from './mock-data/request';

should();
use(chaiHttp);

const prefix = '/api/v1';

describe('/trips/{ oneway | return }', () => {
  let token = '';
  let manager = '';
  before(async () => {
    await db.trip.destroy({ where: {}, force: true });
    await db.room.destroy({ where: {}, force: true });
    await db.hotel.destroy({ where: {}, force: true });
    await db.user.destroy({ where: {}, force: true });
    await db.request.destroy({ where: {}, force: true });
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[1]);
    await roomfactory(tripsData.rooms[2]);
    await requestfactory(tripsData.requests[0]);

    await db.trip.create(tripsData.trips[3]);
    await db.hotel.create(tripsData.hotels[0]);
    manager = await userfactory(requestData.users[0]);
    await db.user.create({
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

  it('POST /trips/oneway - should be able to create a new one way trip request', (done) => {
    request(app)
      .post(`${prefix}/trips/oneway`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.trips[0])
      .end((err, res) => {
        res.status.should.be.eql(201);
        const { data } = res.body;
        data.should.be.an('object');
        data.should.have.property('type').eql('single');
        done();
      });
  });

  it('POST /trips/return - should be able to create a new return trip', (done) => {
    request(app)
      .post(`${prefix}/trips/return`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.trips[4])
      .end((err, res) => {
        res.status.should.be.eql(201);
        const { data } = res.body;
        data.should.be.an('object');
        data.should.have.property('type').eql('single');
        done();
      });
  });

  it('POST /trips/{ oneway | return } - should not be able to book unavailable room', (done) => {
    request(app)
      .post(`${prefix}/trips/return`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.trips[2])
      .end((err, res) => {
        res.status.should.be.eql(409);
        done();
      });
  });

  it('POST /trips/multi-city - should create multi city trips request', (done) => {
    request(app)
      .post(`${prefix}/trips/multi-city`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.multiCityTrips)
      .end((err, res) => {
        res.status.should.be.eql(201);
        const { data } = res.body;
        data.should.be.an('object');
        data.should.have.property('type').eql('multi');
        done();
      });
  });

  it('POST /trips/multi-city - should not create multi city trips request when one trip has missing information', (done) => {
    request(app)
      .post(`${prefix}/trips/multi-city`)
      .set('Authorization', `Bearer ${token}`)
      .send([tripsData.trips[5]])
      .end((err, res) => {
        res.status.should.be.eql(400);
        done();
      });
  });

  it('POST /trips/multi-city - should not create multi city trips request when one trip has booked rooms', (done) => {
    request(app)
      .post(`${prefix}/trips/multi-city`)
      .set('Authorization', `Bearer ${token}`)
      .send([tripsData.trips[6]])
      .end((err, res) => {
        res.status.should.be.eql(409);
        const { data } = res.body;
        data.should.be.an('object');
        data.should.have.property('unAvailableRooms');
        done();
      });
  });
});
