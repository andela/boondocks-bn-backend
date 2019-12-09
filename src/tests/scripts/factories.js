import db from '../../models';

const userfactory = async (data) => {
  const message = await db.user.create(data);
  return message;
};

const messageFactory = async (data) => {
  const user = await db.conversation.create(data);
  return user;
};

const hotelfactory = async (data) => {
  const hotel = await db.hotel.create(data);
  return hotel;
};

const roomfactory = async (data) => {
  const room = await db.room.create(data);
  return room;
};

const tripfactory = async (data) => {
  const trip = await db.room.create(data);
  return trip;
};

const locationfactory = async (data) => {
  const location = await db.location.create(data);
  return location;
};

const requestfactory = async (data) => {
  const request = await db.request.create(data);
  return request;
};

const likesfactory = async (data) => {
  await db.like.create(data);
};

export {
  userfactory,
  hotelfactory,
  roomfactory,
  tripfactory,
  requestfactory,
  locationfactory,
  messageFactory,
  likesfactory
};
