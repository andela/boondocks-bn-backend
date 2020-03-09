import chaiHttp from 'chai-http';
import { use, request, should } from 'chai';
import app from '../app';
import db from '../models';
import tripsData from './mock-data/trips-data';
import Hash from '../utils/hash';
import tokenizer from '../utils/jwt';
import { roomfactory, hotelfactory, locationfactory, bookingfactory, userfactory } from './scripts/factories';
import truncate from './scripts/truncate';
import requestData from './mock-data/request';

should();
use(chaiHttp);

const prefix = '/api/v1';

describe('/booking Accomodation booking', () => {
  let token, travelAdmin, supplierToken, requestId, trip, bookingId, manager;

  before(async () => {
    await truncate();
    await locationfactory({ id: 1, city: 'Kigali', country: 'Rwanda' });
    await locationfactory({ id: 2, city: 'Kampala', country: 'Uganda' });
    await hotelfactory(tripsData.hotels[0]);
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[3]);
    await roomfactory(tripsData.rooms[2]);
    await roomfactory(tripsData.rooms[4]);
    await roomfactory(tripsData.rooms[5]);
    await roomfactory(tripsData.rooms[6]);
    await roomfactory(tripsData.rooms[7]);

    manager = await userfactory(requestData.users[0]);

    await db.user.create({
      id: 1,
      firstName: 'John',
      lastName: 'McCain',
      password: Hash.generateSync('1234567e'),
      email: 'john@mccain.com',
      isVerified: true,
      lineManagerId: manager.id
    });

    await hotelfactory({
      id: 10,
      locationId: 1,
      name: 'Marriot',
      image: 'image.png',
      description: 'hello world',
      services: 'Catering',
      userId: 1,
    });

    token = await tokenizer.signToken({
      id: 1,
      email: 'john@mccain.com',
      isVerified: true,
      firstName: 'John',
      lastName: 'McCain',
      role: 'requester',
      lineManager: 33,
    });

    await db.user.create({
      id: 65,
      firstName: 'John',
      lastName: 'McCain',
      password: Hash.generateSync('1234567e'),
      email: 'john@mccain2.com',
      role: 'travel_administrator',
      isVerified: true,
    });

    travelAdmin = await tokenizer.signToken({
      id: 1,
      email: 'john@mccain2.com',
      isVerified: true,
      role: 'travel_administrator',
      firstName: 'John',
      lastName: 'McCain'
    });

    supplierToken = await tokenizer.signToken({
      id: 1,
      email: 'john@mccain2.com',
      isVerified: true,
      role: 'suppliers',
      firstName: 'John',
      lastName: 'McCain'
    });

    await request(app)
      .post(`${prefix}/trips/oneway`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.trips[9]);

    const testBooking = await bookingfactory(tripsData.booking[5]);
    bookingId = testBooking.id;

    trip = await request(app)
      .post(`${prefix}/trips/return`)
      .set('Authorization', `Bearer ${token}`)
      .send(tripsData.trips[10]);

    requestId = trip.body.data.request.id;
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

  it('GET /booking - Should get all booking for travel admin', (done) => {
    request(app)
      .get(`${prefix}/booking`)
      .set('Authorization', `Bearer ${travelAdmin}`)
      .end((err, res) => {
        res.status.should.be.eql(200);
        done();
      });
  });

  it('GET /booking - Should get all booking for user', (done) => {
    request(app)
      .get(`${prefix}/booking`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.status.should.be.eql(200);
        done();
      });
  });

  it('GET /booking - Should get all booking for supplier', (done) => {
    request(app)
      .get(`${prefix}/booking`)
      .set('Authorization', `Bearer ${supplierToken}`)
      .end((err, res) => {
        res.status.should.be.eql(200);
        done();
      });
  });

  it('PATCH /booking/request/:requestId - Should update trip booking with payment information', (done) => {
    request(app)
      .patch(`${prefix}/booking/request/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        isPaid: true,
        paymentType: 'paypal'
      })
      .end((err, res) => {
        res.status.should.be.eql(200);
        res.body.message.should.be.eql('Bookings updated successfully');
        done();
      });
  });

  it('PATCH /booking/request/:requestId - Should return validation error: isPaid, paymentType', (done) => {
    request(app)
      .patch(`${prefix}/booking/request/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        isPaid: 'notABoolean',
        paymentType: 'wrongString'
      })
      .end((err, res) => {
        res.status.should.be.eql(400);
        done();
      });
  });

  it('PATCH /booking/request/:requestId - Should return validation error: missing description, source, currency, amount', (done) => {
    request(app)
      .patch(`${prefix}/booking/request/${requestId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        isPaid: 'true',
        paymentType: 'stripe'
      })
      .end((err, res) => {
        res.status.should.be.eql(400);
        done();
      });
  });

  it('PATCH /booking/payment - Should update direct booking with payment information', (done) => {
    request(app)
      .patch(`${prefix}/booking/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        isPaid: true,
        paymentType: 'paypal',
        bookingIds: [bookingId]
      })
      .end((err, res) => {
        res.status.should.be.eql(200);
        res.body.message.should.be.eql('Bookings updated successfully');
        done();
      });
  });

  it('PATCH /booking/payment - Should return validation error: isPaid, paymentType, bookingIds', (done) => {
    request(app)
      .patch(`${prefix}/booking/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        isPaid: 'notABoolean',
        paymentType: 'wrongString',
        bookingIds: ['shouldBeInteger']
      })
      .end((err, res) => {
        res.status.should.be.eql(400);
        done();
      });
  });

  it('PATCH /booking/payment - Should return validation error: missing description, source, currency, amount', (done) => {
    request(app)
      .patch(`${prefix}/booking/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        isPaid: 'true',
        paymentType: 'stripe',
        bookingIds: [bookingId]
      })
      .end((err, res) => {
        res.status.should.be.eql(400);
        done();
      });
  });
});
