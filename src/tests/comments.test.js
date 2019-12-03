import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import tripsData from './mock-data/trips-data';
import users from './mock-data/test-users';
import tokenizer from '../utils/jwt';
import { hotelfactory, roomfactory } from './scripts/factories';
import db from '../models';
import truncate from './scripts/truncate';

use(chaiHttp);

describe('Travel request comments', () => {
  const prefix = '/api/v1';
  let rightUserToken, wrongUserToken, requestId, commentExample;

  before(async () => {
    await truncate();
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[1]);
    await roomfactory(tripsData.rooms[2]);
    await hotelfactory(tripsData.hotels[0]);
    const rightUser = (await db.user.create(users[0])).dataValues;
    const wrongUser = (await db.user.create(users[1])).dataValues;

    commentExample = { comment: 'This is a comment on request' };

    rightUserToken = await tokenizer.signToken({
      id: rightUser.id,
      email: rightUser.email,
      isVerified: 1
    });

    wrongUserToken = await tokenizer.signToken({
      id: wrongUser.id,
      email: wrongUser.email,
      isVerified: 1
    });
  });

  before((done) => {
    request(app)
      .post(`${prefix}/trips/oneway`)
      .set('Authorization', `Bearer ${rightUserToken}`)
      .send(tripsData.trips[0])
      .end((err, res) => {
        requestId = res.body.data.id;
        done(err);
      });
  });

  describe('POST /api/v1/requests/:requestId/comment', () => {
    it('should allow the owner of the request to comment successfully', (done) => {
      request(app)
        .post(`/api/v1/requests/${requestId}/comment`)
        .set('Authorization', `Bearer ${rightUserToken}`)
        .send(commentExample)
        .end((_err, res) => {
          expect(res.status)
            .eql(201);
          done();
        });
    });

    it('should not allow other than the owner of the request to comment', (done) => {
      request(app)
        .post(`/api/v1/requests/${requestId}/comment`)
        .set('Authorization', `Bearer ${wrongUserToken}`)
        .send(commentExample)
        .end((_err, res) => {
          expect(res.status)
            .eql(403);
          done();
        });
    });

    it('should not allow to comment if the request doesn\'t exist', (done) => {
      request(app)
        .post('/api/v1/requests/100000000/comment')
        .set('Authorization', `Bearer ${rightUserToken}`)
        .send(commentExample)
        .end((_err, res) => {
          expect(res.status)
            .eql(404);
          done();
        });
    });
  });
});
