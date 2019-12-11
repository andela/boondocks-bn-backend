/* eslint-disable import/no-extraneous-dependencies */
import { request } from 'chai';
import app from '../../app';
import db from '../../models';
import Bcrypt from '../../utils/hash';
import updateTripsData from '../mock-data/update-trips-data';
import requestData from '../mock-data/request';
import truncate from './truncate';

const prepareForTest = async () => {
  let manager = '';
  await truncate();
  const hotelExport = await db.hotel.create(updateTripsData.hotels[0]);
  await db.room.create(updateTripsData.rooms[0]);
  await db.room.create(updateTripsData.rooms[1]);
  manager = await db.user.create(requestData.users[0]);
  await db.user.create({
    firstName: 'Trip',
    lastName: 'Owner',
    password: Bcrypt.generateSync('1234567e'),
    email: 'trip@owner.com',
    role: 'requester',
    isVerified: true,
    lineManagerId: manager.id
  });

  let res = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'trip@owner.com',
      password: '1234567e'
    });

  const tripOwnerTokenExport = `Bearer ${res.body.data.token}`;

  await db.user.create({
    firstName: 'Random',
    lastName: 'Requester',
    password: Bcrypt.generateSync('1234567e'),
    email: 'random@requester.com',
    role: 'requester',
    isVerified: true,
    lineManagerId: manager.id
  });

  res = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'random@requester.com',
      password: '1234567e'
    });

  // Remove keys incase they have been added by another test
  delete updateTripsData.trips[3].requestId;
  delete updateTripsData.trips[3].userId;

  updateTripsData.trips[3].hotelId = hotelExport.id;

  const randomRequesterTokenExport = `Bearer ${res.body.data.token}`;
  const prefix = '/api/v1';
  res = await request(app)
    .post(`${prefix}/trips/oneway`)
    .set('Authorization', tripOwnerTokenExport)
    .send(updateTripsData.trips[3]);

  const existingTripExport = res.body.data;
  updateTripsData.trips[2].requestId = existingTripExport.id;
  updateTripsData.trips[2].userId = existingTripExport.userId;
  const tripExport = await db.trip.create(updateTripsData.trips[2]);

  updateTripsData.trips[6].hotelId = hotelExport.id;

  res = await request(app)
    .post(`${prefix}/trips/oneway`)
    .set('Authorization', randomRequesterTokenExport)
    .send(updateTripsData.trips[6]);

  updateTripsData.trips[3].requestId = existingTripExport.id;
  updateTripsData.trips[3].userId = existingTripExport.userId;
  const tripExport2 = await db.trip.create(updateTripsData.trips[3]);

  await db.user.create({
    firstName: 'Another',
    lastName: 'User',
    password: Bcrypt.generateSync('1234567e'),
    email: 'another@user.com',
    role: 'requester',
    lineManagerId: manager.id
  });

  res = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'another@user.com',
      password: '1234567e'
    });

  const unVerifiedUserTokenExport = `Bearer ${res.body.data.token}`;

  await db.user.create({
    firstName: 'Another2',
    lastName: 'User2',
    password: Bcrypt.generateSync('1234567e'),
    email: 'another2@user.com',
    role: 'requester',
    isVerified: true,
    lineManagerId: manager.id
  });

  res = await request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'another2@user.com',
      password: '1234567e'
    });

  const nonResidentUserTokenExport = `Bearer ${res.body.data.token}`;

  return {
    tripOwnerTokenExport,
    randomRequesterTokenExport,
    tripExport,
    tripExport2,
    hotelExport,
    unVerifiedUserTokenExport,
    nonResidentUserTokenExport
  };
};

const updateRequestStatus = async (requestId) => {
  await db.request.update(
    { status: 'declined' },
    { where: { id: requestId } }
  );
};

export { prepareForTest, updateRequestStatus };
