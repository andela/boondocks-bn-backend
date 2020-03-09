import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import truncate from './scripts/truncate';
import tokenizer from '../utils/jwt';
import mostVisitedData from './mock-data/most-visited';
import app from '../app';
import db from '../models';
import { locationfactory, userfactory, hotelfactory, roomfactory } from './scripts/factories';

use(chaiHttp);

describe('Most travel destinations', () => {
  const prefix = '/api/v1';
  let userToken, hotelId, roomId, to, from;

  before(async () => {
    await truncate();
    from = await locationfactory({ id: 1, city: 'Kigali', country: 'Rwanda' });
    to = await locationfactory({ id: 2, city: 'Nairobi', country: 'Kenya' });
    await userfactory(mostVisitedData.users[0]);

    const currentUser = await userfactory(mostVisitedData.users[1]);

    hotelId = (await hotelfactory(mostVisitedData.hotels[0])).id;
    roomId = (await roomfactory(mostVisitedData.rooms[0])).id;
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
            expect(res.status).to.eq(200);
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
          leavingFrom: from.id,
          goingTo: to.id,
          travelDate: '2019-11-18',
          reason: 'visit our agents',
          hotelId,
          type: 'one way',
          rooms: [roomId],
        })
        .end(async (err, res) => {
          await db.request.update(
            { status: 'approved' },
            { where: { id: res.body.data.request.id } },
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
