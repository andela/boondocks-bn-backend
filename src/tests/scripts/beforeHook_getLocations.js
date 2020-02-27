/* eslint-disable import/no-extraneous-dependencies */
import { request } from 'chai';
import app from '../../app';
import db from '../../models';
import Bcrypt from '../../utils/hash';
import updateTripsData from '../mock-data/locations-trips-data';
import requestData from '../mock-data/request';
import truncate from './truncate';
import { locationfactory } from './factories';
import tokenizer from '../../utils/jwt';

const prepareForTest = async () => {
  let manager = '';
  await truncate();
  await locationfactory({ id: 14, city: 'Kigali', country: 'Rwanda' });
  await locationfactory({ id: 24, city: 'Nairobi', country: 'Kenya' });
  await locationfactory({ id: 34, city: 'Kampala', country: 'Uganda' });
  await locationfactory({ id: 45, city: 'Lagos', country: 'Nigeria' });
  await locationfactory({ id: 54, city: 'Cairo', country: 'Egypt' });
  await locationfactory({ id: 64, city: 'Accra', country: 'Ghana' });
  const hotelExport = await db.hotel.create(updateTripsData.hotels[0]);
  await db.room.create(updateTripsData.rooms[0]);
  await db.room.create(updateTripsData.rooms[1]);
  manager = await db.user.create(requestData.users[0]);
  const user1 = await db.user.create({
    id: 48,
    firstName: 'Trip',
    lastName: 'Owner',
    password: Bcrypt.generateSync('1234567e'),
    email: 'trip@owner14.com',
    role: 'requester',
    isVerified: true,
    lineManagerId: manager.id
  });

  const tripOwnerTokenExport = `Bearer ${await tokenizer.signToken(user1.dataValues)}`;

  const user2 = await db.user.create({
    id: 49,
    firstName: 'Random',
    lastName: 'Requester',
    password: Bcrypt.generateSync('1234567e'),
    email: 'random@requester14.com',
    role: 'requester',
    isVerified: true,
    lineManagerId: manager.id
  });

  const randomRequesterTokenExport = `Bearer ${await tokenizer.signToken(user2.dataValues)}`;
  const trips3 = { ...updateTripsData.trips[3], hotelId: hotelExport.id };
  const prefix = '/api/v1';

  let res = await request(app)
    .post(`${prefix}/trips/oneway`)
    .set('Authorization', tripOwnerTokenExport)
    .send(trips3);

  const existingTripExport = res.body.data.request;
  const trips2 = { ...updateTripsData.trips[2],
    requestId: existingTripExport.id,
    userId: existingTripExport.userId
  };

  const tripExport = await db.trip.create(trips2);
  const trips6 = { ...updateTripsData.trips[6], hotelId: hotelExport.id };

  res = await request(app)
    .post(`${prefix}/trips/oneway`)
    .set('Authorization', randomRequesterTokenExport)
    .send(trips6);

  const trips33 = { ...updateTripsData.trips[3],
    requestId: existingTripExport.id,
    userId: existingTripExport.userId
  };

  const tripExport2 = await db.trip.create(trips33);

  const user3 = await db.user.create({
    id: 50,
    firstName: 'Another',
    lastName: 'User',
    password: Bcrypt.generateSync('1234567e'),
    email: 'another@user14.com',
    role: 'requester',
    lineManagerId: manager.id
  });

  const unVerifiedUserTokenExport = `Bearer ${await tokenizer.signToken(user3.dataValues)}`;

  const user4 = await db.user.create({
    id: 51,
    firstName: 'Another2',
    lastName: 'User2',
    password: Bcrypt.generateSync('1234567e'),
    email: 'another2@user14.com',
    role: 'requester',
    isVerified: true,
    lineManagerId: manager.id
  });

  const nonResidentUserTokenExport = `Bearer ${await tokenizer.signToken(user4.dataValues)}`;

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
