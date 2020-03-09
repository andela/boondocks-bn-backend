import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import tripsData from './mock-data/trips-data';
import requestData from './mock-data/request';
import tokenizer from '../utils/jwt';
import { hotelfactory, roomfactory, userfactory, locationfactory } from './scripts/factories';
import db from '../models';
import truncate from './scripts/truncate';

use(chaiHttp);

describe('Hotels feedback', () => {
  const prefix = '/api/v1';
  let user, user2, token, hotel, feedbackExample, room, token2;

  before(async () => {
    await db.feedback.destroy({
      where: {},
      force: true,
    });
    await truncate();
    await locationfactory({ id: 1, city: 'Kigali', country: 'Rwanda' });
    await locationfactory({ id: 2, city: 'Nairobi', country: 'Kenya' });
    hotel = await hotelfactory(tripsData.hotels[0]);
    room = await roomfactory({ ...tripsData.rooms[5], hotelId: hotel.id });
    const manager = await userfactory(requestData.users[0]);
    user = await db.user.create({
      firstName: 'John',
      lastName: 'Doe',
      password: '12345678',
      email: 'john@barefoot.com',
      lineManagerId: manager.id,
    });
    user2 = await db.user.create({
      firstName: 'John',
      lastName: 'Doe',
      password: '12345678',
      email: 'johndoe@barefoot.com',
      lineManagerId: manager.id,
    });

    feedbackExample = { feedback: 'This is hotel is great!' };

    token = await tokenizer.signToken({
      id: user.id,
      email: user.email,
      isVerified: 1,
    });
    token2 = await tokenizer.signToken({
      id: user2.id,
      email: user2.email,
      isVerified: 1,
    });
  });
  before((done) => {
    request(app)
      .post(`${prefix}/trips/oneway`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...tripsData.trips[7], hotelId: hotel.id, rooms: [room.id] })
      .end((err, res) => {
        expect(res.status)
          .eql(201);
        done(err);
      });
  });

  describe('POST /api/v1/hotels/:hotelid/feedback', () => {
    it('should allow the user to post feedback successfully', (done) => {
      request(app)
        .post(`${prefix}/hotels/${hotel.id}/feedback`)
        .set('Authorization', `Bearer ${token}`)
        .send(feedbackExample)
        .end((err, res) => {
          expect(res.status)
            .eql(201);
          done(err);
        });
    });

    it('should not allow to feedback if the hotel doesn\'t exist', (done) => {
      request(app)
        .post(`${prefix}/hotels/100000000/feedback`)
        .set('Authorization', `Bearer ${token}`)
        .send(feedbackExample)
        .end((err, res) => {
          expect(res.status)
            .eql(400);
          done(err);
        });
    });

    it('should not allow user to post feedback if the hotel he/she has never booked', (done) => {
      request(app)
        .post(`${prefix}/hotels/${hotel.id}/feedback`)
        .set('Authorization', `Bearer ${token2}`)
        .send(feedbackExample)
        .end((err, res) => {
          expect(res.status)
            .eql(400);
          done(err);
        });
    });
  });
});
