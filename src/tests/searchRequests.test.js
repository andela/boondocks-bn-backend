import chaiHttp from 'chai-http';
// eslint-disable-next-line object-curly-newline
import { expect, request, should, use } from 'chai';
import app from '../app';
import { prepareForTest } from './scripts/beforeHook_searchRequests';

should();
use(chaiHttp);

const prefix = '/api/v1';
let requesterToken, lineManagerToken, res, searchString, travelDate, returnDate;

describe(('/GET /search/requests'), () => {
  before(async () => {
    const tokens = await prepareForTest();
    requesterToken = tokens.tripOwnerTokenExport;
    lineManagerToken = tokens.ownLineManagerToken;
  });

  it(('it successfully returns related search records with a single search string'), async () => {
    searchString = 'open';
    travelDate = '2019-01-01';
    returnDate = '2019-12-31';
    res = await request(app)
      .get(`${prefix}/search/requests?searchString=${searchString}&travelDate=${travelDate}&returnDate=${returnDate}`)
      .set('Authorization', requesterToken);
    expect(res.status).eql(200);
    expect(res.body.message).eql('successfully retrieved search results');
  });

  it(('it successfully returns related search records with multiple search strings'), async () => {
    searchString = 'open nairobi';
    travelDate = '2019-01-01';
    returnDate = '2019-12-31';
    res = await request(app)
      .get(`${prefix}/search/requests?searchString=${searchString}&travelDate=${travelDate}&returnDate=${returnDate}`)
      .set('Authorization', requesterToken);
    expect(res.status).eql(200);
  });

  it(('it fails to return searched records if search parameters don\'t match existing records'), async () => {
    travelDate = '2020-01-01';
    searchString = 'open';
    returnDate = '2020-12-31';
    res = await request(app)
      .get(`${prefix}/search/requests?searchString=${searchString}&travelDate=${travelDate}&returnDate=${returnDate}`)
      .set('Authorization', requesterToken);
    expect(res.status).eql(404);
  });

  it(('it still returns searched records when user doesn\'t supply dates in request'), async () => {
    searchString = 'open';
    res = await request(app)
      .get(`${prefix}/search/requests?searchString=${searchString}`)
      .set('Authorization', requesterToken);
    expect(res.status).eql(200);
  });

  it(('it still returns searched records when user doesn\'t supply request status'), async () => {
    searchString = 'Nairobi';
    res = await request(app)
      .get(`${prefix}/search/requests?searchString=${searchString}`)
      .set('Authorization', requesterToken);
    expect(res.status).eql(200);
  });

  it(('it returns an error when searchString not passed'), async () => {
    res = await request(app)
      .get(`${prefix}/search/requests`)
      .set('Authorization', requesterToken);
    expect(res.status).eql(400);
  });

  it(('it successfully returns related search records with a single search string LINEMANAGER'), async () => {
    searchString = 'open';
    travelDate = '2019-01-01';
    returnDate = '2019-12-31';
    res = await request(app)
      .get(`${prefix}/search/requests?byLineManager=true&searchString=${searchString}`)
      .set('Authorization', lineManagerToken);
    expect(res.status).eql(200);
    expect(res.body.message).eql('successfully retrieved search results');
  });

  it(('it successfully returns related search records with multiple search strings LINEMANAGER'), async () => {
    searchString = 'open Nairobi';
    travelDate = '2019-01-01';
    returnDate = '2019-12-31';
    res = await request(app)
      .get(`${prefix}/search/requests?byLineManager=true&searchString=${searchString}&travelDate=${travelDate}&returnDate=${returnDate}`)
      .set('Authorization', lineManagerToken);
    expect(res.status).eql(200);
  });

  it(('it fails to return searched records if search parameters don\'t match existing records LINEMANAGER'), async () => {
    travelDate = '2020-01-01';
    searchString = 'open';
    returnDate = '2020-12-31';
    res = await request(app)
      .get(`${prefix}/search/requests?byLineManager=true&searchString=${searchString}&travelDate=${travelDate}&returnDate=${returnDate}`)
      .set('Authorization', lineManagerToken);
    expect(res.status).eql(404);
  });

  it(('it still returns searched records when user doesn\'t supply dates in request LINEMANAGER'), async () => {
    searchString = 'open';
    res = await request(app)
      .get(`${prefix}/search/requests?byLineManager=true&searchString=${searchString}`)
      .set('Authorization', lineManagerToken);
    expect(res.status).eql(200);
  });

  it(('it still returns searched records when user doesn\'t supply request status LINEMANAGER'), async () => {
    searchString = 'Nairobi';
    res = await request(app)
      .get(`${prefix}/search/requests?byLineManager=true&searchString=${searchString}`)
      .set('Authorization', lineManagerToken);
    expect(res.status).eql(200);
  });

  it(('it returns an error when searchString not passed LINEMANAGER'), async () => {
    res = await request(app)
      .get(`${prefix}/search/requests?byLineManager=true`)
      .set('Authorization', lineManagerToken);
    expect(res.status).eql(400);
  });
});
