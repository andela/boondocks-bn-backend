import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import tripsData from './mock-data/trips-data';
import requestData from './mock-data/request';
import tokenizer from '../utils/jwt';
import { hotelfactory, roomfactory, userfactory } from './scripts/factories';
import db from '../models';
import truncate from './scripts/truncate';

use(chaiHttp);

describe('Travel request comments', () => {
  const prefix = '/api/v1';
  let rightUserToken,
    managerToken,
    wrongUserToken,
    requestId,
    commentExample,
    manager,
    rightUser,
    wrongUser,
    commentId,
    othersComment;

  before(async () => {
    await truncate();
    await roomfactory(tripsData.rooms[0]);
    await roomfactory(tripsData.rooms[1]);
    await roomfactory(tripsData.rooms[2]);
    await hotelfactory(tripsData.hotels[0]);
    manager = await userfactory(requestData.users[0]);
    rightUser = await db.user.create({
      firstName: 'John',
      lastName: 'Doe',
      password: '12345678',
      email: 'john@barefoot.com',
      lineManagerId: manager.id
    });
    wrongUser = await db.user.create({
      firstName: 'Eric',
      lastName: 'Doe',
      password: '12345678',
      email: 'eric1@barefoot.com',
      lineManagerId: manager.id
    });

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

    managerToken = await tokenizer.signToken(manager);
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

    it('should allow the owner of the request to comment successfully', (done) => {
      request(app)
        .post(`/api/v1/requests/${requestId}/comment`)
        .set('Authorization', `Bearer ${managerToken}`)
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
      userId: rightUser.id,
      comment: 'This is an example comment!',
      isVisible: true,
    });
    commentId = await comment.id;

    othersComment = await db.comment.create({
      requestId,
      userId: manager.id,
      comment: 'Another comment!',
      isVisible: true
    });
  });

  describe(`PATCH ${prefix}/comments/:commentId/delete`, async () => {
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
