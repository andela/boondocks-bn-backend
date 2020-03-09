import chaiHttp from 'chai-http';
import { use, request, should } from 'chai';
import app from '../app';
import tripsData from './mock-data/trips-data';
import Hash from '../utils/hash';
import tokenizer from '../utils/jwt';
import {
  roomfactory,
  userfactory,
  locationfactory,
  hotelfactory } from './scripts/factories';
import requestData from './mock-data/request';
import truncate from './scripts/truncate';

should();
use(chaiHttp);

const prefix = '/api/v1';

describe('/trips/{ oneway | return }', () => {
  let token = '';
  let manager = '';
  before(async () => {
    await truncate();
    await locationfactory({ id: 1, city: 'Kigali', country: 'Rwanda' });
    await locationfactory({ id: 2, city: 'Nairobi', country: 'Kenya' });
    await hotelfactory(tripsData.hotels[0]);
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[1]);
    await roomfactory(tripsData.rooms[2]);
    await roomfactory(tripsData.rooms[3]);
    await roomfactory(tripsData.rooms[4]);

    manager = await userfactory(requestData.users[0]);
    await userfactory({
      id: 19,
      firstName: 'John',
      lastName: 'McCain',
      password: Hash.generateSync('1234567e'),
      email: 'john@mccain.com',
      lineManagerId: manager.id
    });
    token = await tokenizer.signToken({
      id: 19,
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
        const requestResponse = data.request;
        requestResponse.should.be.an('object');
        requestResponse.should.have.property('type').eql('single');
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
        const requestResponse = data.request;
        requestResponse.should.be.an('object');
        requestResponse.should.have.property('type').eql('single');
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
        const requestResponse = data.request;
        requestResponse.should.be.an('object');
        requestResponse.should.have.property('type').eql('multi');
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

  it('POST /trips/oneway - should be able to create a new one way trip request without hotel and rooms', (done) => {
    request(app)
      .post(`${prefix}/trips/oneway`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.trips[7])
      .end((err, res) => {
        res.status.should.be.eql(201);
        const { data } = res.body;
        const requestResponse = data.request;
        requestResponse.should.be.an('object');
        requestResponse.should.have.property('type').eql('single');
        done();
      });
  });

  it('POST /trips/oneway - fail to create rooms if rooms is not integer', (done) => {
    request(app)
      .post(`${prefix}/trips/oneway`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.trips[8])
      .end((err, res) => {
        res.status.should.be.eql(400);
        done();
      });
  });
});
