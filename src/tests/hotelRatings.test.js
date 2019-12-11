import chaiHttp from 'chai-http';
// eslint-disable-next-line object-curly-newline
import { use, request, expect, should } from 'chai';
import app from '../app';
import { prepareForTest } from './scripts/beforeHook_tripsUpdate';

should();
use(chaiHttp);

const prefix = '/api/v1';
let requesterToken, initialRating, testHotel, unVerifiedUserToken, nonResidentUserToken;

describe(('Hotels rating testing'), () => {
  before(async () => {
    const params = await prepareForTest();
    requesterToken = params.tripOwnerTokenExport;
    testHotel = params.hotelExport;
    unVerifiedUserToken = params.unVerifiedUserTokenExport;
    nonResidentUserToken = params.nonResidentUserTokenExport;
  });

  it(('it fails to post hotel rating if user has not verified email'), async () => {
    initialRating = await request(app)
      .post(`${prefix}/hotels/${testHotel.id}/rating`)
      .set('Authorization', unVerifiedUserToken)
      .send({
        rating: 3
      });
    expect(initialRating.status).eql(401);
    expect(initialRating.body.message).eql('Please verify your account through the confirmation email sent to you on registration');
  });

  it(('it fails to post hotel rating if user has not had a trip posted under the subject hotel'), async () => {
    initialRating = await request(app)
      .post(`${prefix}/hotels/${testHotel.id}/rating`)
      .set('Authorization', nonResidentUserToken)
      .send({
        rating: 3
      });
    expect(initialRating.status).eql(401);
    expect(initialRating.body.message).eql('You can only rate a hotel you have stayed at on a trip');
  });

  it(('it successfully returns a newly entered hotel rating'), async () => {
    initialRating = await request(app)
      .post(`${prefix}/hotels/${testHotel.id}/rating`)
      .set('Authorization', requesterToken)
      .send({
        rating: 3
      });
    expect(initialRating.status).eql(201);
    expect(initialRating.body.message).eql('Hotel rated successfully');
  });

  it(('it fails to post a duplicate hotel rating'), async () => {
    const res = await request(app)
      .post(`${prefix}/hotels/${testHotel.id}/rating`)
      .set('Authorization', requesterToken)
      .send({
        rating: 3
      });
    expect(res.status).eql(403);
  });

  it(('it fails to allow another user change your rating'), async () => {
    const ratingId = initialRating.body.data[0].id;
    const res = await request(app)
      .patch(`${prefix}/rating/${ratingId}`)
      .set('Authorization', nonResidentUserToken)
      .send({
        rating: 3
      });
    expect(res.status).eql(401);
  });

  it(('it fails to update a rating that doesn\'t exist'), async () => {
    const res = await request(app)
      .get(`${prefix}/rating/-1`)
      .set('Authorization', requesterToken);
    expect(res.status).eql(404);
  });

  it(('it successfully returns an updated hotel rating'), async () => {
    const ratingId = initialRating.body.data[0].id;
    const res = await request(app)
      .patch(`${prefix}/rating/${ratingId}`)
      .set('Authorization', requesterToken)
      .send({
        rating: 4
      });
    expect(res.status).eql(201);
  });

  it(('it successfully returns a hotel rating'), async () => {
    const ratingId = initialRating.body.data[0].id;
    const res = await request(app)
      .get(`${prefix}/rating/${ratingId}`)
      .set('Authorization', requesterToken);
    expect(res.status).eql(200);
    expect(res.body.message).eql('Hotel rating fetched successfully');
  });
});
