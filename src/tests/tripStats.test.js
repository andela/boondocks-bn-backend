import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import tripsData from './mock-data/trips-stats';
import { userfactory, hotelfactory, roomfactory, locationfactory } from './scripts/factories';
import tokenizer from '../utils/jwt';
import truncate from './scripts/truncate';

use(chaiHttp);

describe('Trip Statistics', () => {
  let
    userToken,
    rightManagerToken,
    wrongManagerToken,
    travelAdminToken,
    pastDate,
    futureDate;

  const prefix = '/api/v1';

  before(async () => {
    await truncate();
    await userfactory(tripsData.users[0]);
    await userfactory(tripsData.users[1]);
    await userfactory(tripsData.users[2]);
    await userfactory(tripsData.users[3]);

    await locationfactory({ id: 12, city: 'Kigali', country: 'Rwanda' });
    await locationfactory({ id: 15, city: 'new city', country: 'country' });
    await hotelfactory(tripsData.hotels[0]);
    await roomfactory(tripsData.rooms[0]);

    userToken = await tokenizer.signToken(tripsData.users[2]);
    rightManagerToken = await tokenizer.signToken(tripsData.users[0]);
    wrongManagerToken = await tokenizer.signToken(tripsData.users[1]);
    travelAdminToken = await tokenizer.signToken(tripsData.users[3]);

    pastDate = new Date((new Date()).setDate((new Date()).getDate() - 30));
    futureDate = new Date((new Date()).setDate((new Date()).getDate() + 30));
  });

  before((done) => {
    request(app)
      .post(`${prefix}/trips/oneway`)
      .set('Authorization', `Bearer ${travelAdminToken}`)
      .send(tripsData.trips[0])
      .end((err) => {
        done(err);
      });
  });
  it(
    'should refuse to roles other than \'manager\' and \'requester\' from access the service',
    (done) => {
      request(app)
        .get(`${prefix}/trips/stats?userId=3&fromDate=${pastDate}`)
        .set('Authorization', `Bearer ${travelAdminToken}`)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).eql(400);
          done();
        });
    },
  );
  it('should require the \'lineManager\' can fetch all his users trips', (done) => {
    request(app)
      .get(`/api/v1/trips/stats?fromDate=${pastDate}`)
      .set('Authorization', `Bearer ${rightManagerToken}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).eql(200);
        done();
      });
  });
  it('should require the \'lineManager\' can fetch all his users trips over time', (done) => {
    request(app)
      .get('/api/v1/trips/stats')
      .set('Authorization', `Bearer ${rightManagerToken}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).eql(200);
        done();
      });
  });
  it('should throw the error if the user does not exist', (done) => {
    request(app)
      .get(`/api/v1/trips/stats?userId=3000&fromDate=${pastDate}`)
      .set('Authorization', `Bearer ${rightManagerToken}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).eql(404);
        done(err);
      });
  });
  it(
    'should not show the trip for a role other than \'requester\' user',
    (done) => {
      request(app)
        .get(`/api/v1/trips/stats?userId=2&fromDate=${pastDate}`)
        .set('Authorization', `Bearer ${rightManagerToken}`)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).eql(422);
          done();
        });
    },
  );
  it(
    'should not show you the trips statistics for users you don\'t manage',
    (done) => {
      request(app)
        .get(`/api/v1/trips/stats?userId=3&fromDate=${pastDate}`)
        .set('Authorization', `Bearer ${wrongManagerToken}`)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).eql(400);
          done();
        });
    },
  );
  it('should fromDate be in the past', (done) => {
    request(app)
      .get(`/api/v1/trips/stats?userId=3&fromDate=${futureDate}`)
      .set('Authorization', `Bearer ${rightManagerToken}`)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.status).eql(422);
        done();
      });
  });
  it(
    'should retrieve trips and their counts successfully for the lineManager to his users',
    (done) => {
      request(app)
        .get(`/api/v1/trips/stats?userId=3&fromDate=${pastDate}`)
        .set('Authorization', `Bearer ${rightManagerToken}`)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).eql(200);
          done();
        });
    },
  );
  it(
    'should retrieve trips and their counts successfully for the owner of the trips',
    (done) => {
      request(app)
        .get(`/api/v1/trips/stats?fromDate=${pastDate}`)
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).eql(200);
          done();
        });
    },
  );
  it(
    'should retrieve trips and their counts successfully for the owner of the trips',
    (done) => {
      request(app)
        .get('/api/v1/trips/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          if (err) {
            done(err);
          }
          expect(res.status).eql(200);
          done();
        });
    },
  );
});
