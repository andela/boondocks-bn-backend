import chaiHttp from 'chai-http';
// eslint-disable-next-line object-curly-newline
import { use, request, expect, should } from 'chai';
import app from '../app';
import { prepareForTest } from './scripts/beforeHook_tripsUpdate';

should();
use(chaiHttp);

const prefix = '/api/v1';
let requesterToken;

describe(('/GET /requests/search'), () => {
  before(async () => {
    const tokens = await prepareForTest();
    requesterToken = tokens.tripOwnerTokenExport;
  });

  it(('it successfully returns related search records with a single search string'), async () => {
    const res = await request(app)
      .post(`${prefix}/requests/search`)
      .set('Authorization', requesterToken)
      .send({
        travelDate: '2019-01-01',
        searchString: 'open',
        returnDate: '2019-12-31'
      });
    expect(res.status).eql(200);
    expect(res.body.message).eql('successfully retrieved search results');
  });

  it(('it successfully returns related search records with multiple search strings'), async () => {
    const res = await request(app)
      .post(`${prefix}/requests/search`)
      .set('Authorization', requesterToken)
      .send({
        travelDate: '2019-01-01',
        searchString: 'open nairobi',
        returnDate: '2019-12-31'
      });
    expect(res.status).eql(200);
  });

  it(('it fails to return searched records if search parameters don\'t match existing records'), async () => {
    const res = await request(app)
      .post(`${prefix}/requests/search`)
      .set('Authorization', requesterToken)
      .send({
        travelDate: '2020-01-01',
        searchString: 'open',
        returnDate: '2020-12-31'
      });
    expect(res.status).eql(404);
  });

  it(('it still returns searched records user doesn\'t supply dates in request'), async () => {
    const res = await request(app)
      .post(`${prefix}/requests/search`)
      .set('Authorization', requesterToken)
      .send({
        searchString: 'open',
      });
    expect(res.status).eql(200);
  });

  it(('it still returns searched records when user doesn\'t supply request status'), async () => {
    const res = await request(app)
      .post(`${prefix}/requests/search`)
      .set('Authorization', requesterToken)
      .send({
        searchString: 'Nairobi',
      });
    expect(res.status).eql(200);
  });
});
