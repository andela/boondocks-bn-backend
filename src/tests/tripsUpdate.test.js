import chaiHttp from 'chai-http';
// eslint-disable-next-line object-curly-newline
import { use, request, expect, should } from 'chai';
import app from '../app';
import { prepareForTest, updateRequestStatus } from './scripts/beforeHook_tripsUpdate';
import updateTripsData from './mock-data/update-trips-data';

should();
use(chaiHttp);

const prefix = '/api/v1';
let tripOwnerToken;
let randomRequesterToken;
let existingTrip;
let secondTrip;

describe('/PATCH /trips/:tripId', () => {
  before(async () => {
    const params = await prepareForTest();
    tripOwnerToken = params.tripOwnerTokenExport;
    randomRequesterToken = params.randomRequesterTokenExport;
    existingTrip = params.tripExport;
    secondTrip = params.tripExport2;
  });
  it('successfully updates trip if requested by trip owner', async () => {
    const res = await request(app)
      .patch(`${prefix}/trips/${existingTrip.id}`)
      .set('Authorization', tripOwnerToken)
      .send(updateTripsData.trips[5]);
    expect(res.status).eql(201);
    expect(res.body.message).eql('trip details updated successfully');
  });

  it('fail to update trip if requested by user who is not trip owner', async () => {
    const res = await request(app)
      .patch(`${prefix}/trips/${existingTrip.id}`)
      .set('Authorization', randomRequesterToken)
      .send(updateTripsData.trips[6]);
    expect(res.status).eql(403);
    expect(res.body.message).eql('you can only edit your own trips');
  });

  it('fail to update trip if trip id doesn\'t exist', async () => {
    const res = await request(app)
      .patch(`${prefix}/trips/-1`)
      .set('Authorization', tripOwnerToken)
      .send(updateTripsData.trips[5]);
    expect(res.status).eql(404);
    expect(res.body.message).eql('no such trip exists');
  });

  it('fail to update trip if rooms is not an array on integers', async () => {
    const res = await request(app)
      .patch(`${prefix}/trips/${existingTrip.id}`)
      .set('Authorization', tripOwnerToken)
      .send(updateTripsData.trips[4]);
    expect(res.status).eql(400);
    expect(res.body.message).eql(['rooms must be an integer value']);
  });

  it('fail to update trip if room(s) already booked by other requester', async () => {
    updateTripsData.trips[4].rooms = [2];
    const res = await request(app)
      .patch(`${prefix}/trips/${secondTrip.id}`)
      .set('Authorization', randomRequesterToken)
      .send(updateTripsData.trips[4]);
    expect(res.status).eql(409);
    expect(res.body.message).eql('room(s) already booked by other requester');
  });

  it('fail to update trip if request status is not open', async () => {
    await updateRequestStatus(existingTrip.requestId);
    const res = await request(app)
      .patch(`${prefix}/trips/${existingTrip.id}`)
      .set('Authorization', tripOwnerToken)
      .send(updateTripsData.trips[5]);
    expect(res.status).eql(409);
    expect(res.body.message).eql('you can only edit trips whose request status is open');
  });
});
