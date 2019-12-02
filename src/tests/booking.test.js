import chaiHttp from 'chai-http';
import { use, request, should } from 'chai';
import app from '../app';
import db from '../models';
import tripsData from './mock-data/trips-data';
import Hash from '../utils/hash';
import tokenizer from '../utils/jwt';
import { roomfactory, hotelfactory } from './scripts/factories';
import truncate from './scripts/truncate';

should();
use(chaiHttp);

const prefix = '/api/v1';

describe('/booking Accomodation booking', () => {
  let token = '';
  before(async () => {
    await truncate();
    await hotelfactory(tripsData.hotels[0]);
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[3]);
    await roomfactory(tripsData.rooms[2]);
    await db.user.create({
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

  it('POST /booking - user should be able to book an accomodation', (done) => {
    request(app)
      .post(`${prefix}/booking`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.booking[0])
      .end((err, res) => {
        const { data } = res.body;
        res.status.should.be.eql(201);
        data.should.be.an('object');
        done();
      });
  });

  it('POST /booking - Arrival date must not be the day in past', (done) => {
    request(app)
      .post(`${prefix}/booking`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.booking[1])
      .end((err, res) => {
        res.status.should.be.eql(400);
        done();
      });
  });

  it('POST /booking - leaving date must be today or in future', (done) => {
    request(app)
      .post(`${prefix}/booking`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.booking[2])
      .end((err, res) => {
        res.status.should.be.eql(400);
        done();
      });
  });

  it('POST /booking - Should not book unregistered rooms', (done) => {
    request(app)
      .post(`${prefix}/booking`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.booking[3])
      .end((err, res) => {
        res.status.should.be.eql(409);
        done();
      });
  });

  it('POST /booking - Should not book when there some unregistered rooms', (done) => {
    request(app)
      .post(`${prefix}/booking`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.booking[4])
      .end((err, res) => {
        res.status.should.be.eql(409);
        done();
      });
  });
});
