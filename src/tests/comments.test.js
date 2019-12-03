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
  let
    rightUserToken,
    wrongUserToken,
    rightUserId,
    requestId,
    commentExample,
    othersComment,
    commentId;

  before(async () => {
    await truncate();
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[1]);
    await roomfactory(tripsData.rooms[2]);
    await hotelfactory(tripsData.hotels[0]);
    const rightUser = await db.user.create(users[0]);
    const wrongUser = await db.user.create(users[1]);
    othersComment = await db.comment.create({
      requestId: 2000000,
      userId: 2000000,
      comment: 'Another comment!',
      isVisible: true
    });

    commentExample = { comment: 'This is a comment on request' };

    rightUserId = rightUser.id;

    rightUserToken = await tokenizer.signToken({
      id: rightUserId,
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

  context('POST /api/v1/requests/:requestId/comment', () => {
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

  before(async () => {
    const comment = await db.comment.create({
      requestId,
      userId: rightUserId,
      comment: 'This is an example comment!',
      isVisible: true,
    });
    commentId = await comment.id;
  });

  context(`PATCH ${prefix}/comments/:commentId/delete`, async () => {
    it('should allow the owner of the request to delete the comment successfully', (done) => {
      request(app)
        .patch(`${prefix}/comments/${commentId}/delete`)
        .set('Authorization', `Bearer ${rightUserToken}`)
        .end((err, res) => {
          expect(res.status)
            .eql(200);
          done(err);
        });
    });

    it('should not allow other than the owner of the request to delete the comment', (done) => {
      request(app)
        .patch(`${prefix}/comments/${othersComment.id}/delete`)
        .set('Authorization', `Bearer ${rightUserToken}`)
        .end((err, res) => {
          expect(res.status)
            .eql(403);
          done(err);
        });
    });

    it('should throw a not found exception when comment is missing', (done) => {
      request(app)
        .patch(`${prefix}/comments/30000000/delete`)
        .set('Authorization', `Bearer ${rightUserToken}`)
        .end((err, res) => {
          expect(res.status)
            .eql(404);
          done(err);
        });
    });

    it('should throw an already deleted exception when comment was already deleted', (done) => {
      request(app)
        .patch(`${prefix}/comments/${commentId}/delete`)
        .set('Authorization', `Bearer ${rightUserToken}`)
        .end((err, res) => {
          expect(res.status)
            .eql(403);
          done(err);
        });
    });
  });
});
