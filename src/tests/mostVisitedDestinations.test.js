import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import truncate from './scripts/truncate';
import tokenizer from '../utils/jwt';
import mostVisitedData from './mock-data/most-visited';
import app from '../app';
import db from '../models';

use(chaiHttp);

describe('Most travel destinations', () => {
  const prefix = '/api/v1';
  let userToken, hotelId, roomId;

  before(async () => {
    await db.like.destroy({ where: {}, force: true });
    await truncate();
    await db.user.create(mostVisitedData.users[0]);
    await db.location.create(mostVisitedData.locations[0]);

    const currentUser = await db.user.create(mostVisitedData.users[1]);

    hotelId = (await db.hotel.create(mostVisitedData.hotels[0])).id;
    roomId = (await db.room.create(mostVisitedData.rooms[0])).id;
    userToken = await tokenizer.signToken(currentUser);
  });

  describe('If there are no past trips', () => {
    it(
      'should throw error with no previous trips',
      (done) => {
        request(app)
          .get(`${prefix}/hotels/most-travelled`)
          .set('Authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res.status).to.eq(404);
            done(err);
          });
      },
    );
  });
  describe('If there are some past trips', () => {
    before((done) => {
      request(app)
        .post(`${prefix}/trips/oneway`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          leavingFrom: 'Kigali',
          goingTo: 'Nairobi',
          travelDate: '2019-11-18',
          reason: 'visit our agents',
          hotelId,
          type: 'return',
          rooms: [roomId],
        })
        .end(async (err, res) => {
          await db.request.update(
            { status: 'approved' },
            { where: { id: res.body.data.id } },
          );
          done();
        });
    });

    it('should show Most travelled destination', (done) => {
      request(app)
        .get(`${prefix}/hotels/most-travelled`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.eq(200);
          done(err);
        });
    });
  });
});
