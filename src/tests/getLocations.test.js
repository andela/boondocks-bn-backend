import chaiHttp from 'chai-http';
import { use, request, should } from 'chai';
import app from '../app';
import { prepareForTest } from './scripts/beforeHook_getLocations';

should();
use(chaiHttp);

const prefix = '/api/v1';
let requesterToken;

describe(('/GET /locations'), () => {
  before(async () => {
    const tokens = await prepareForTest();
    requesterToken = tokens.tripOwnerTokenExport;
  });

  it('GET /location - user should be able to get all locations', async () => {
    const res = await request(app)
      .get(`${prefix}/location`)
      .set('Authorization', requesterToken);
    res.status.should.be.equal(200);
    res.body.message.should.equal('Locations fetched successfully');
  });

  it('GET /location - user should be able to get all locations with hotels', async () => {
    const res = await request(app)
      .get(`${prefix}/location/?with_hotels=true`)
      .set('Authorization', requesterToken);
    res.status.should.be.equal(200);
    res.body.message.should.equal('Locations fetched successfully');
  });

  it('GET /location - user not provided token should not be able to get locations', async () => {
    const res = await request(app)
      .get(`${prefix}/location`);
    res.status.should.be.equal(401);
    res.body.message.should.equal('Token not provided');
  });
});
