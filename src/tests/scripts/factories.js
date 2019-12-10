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
  await db.hotel.create(data);
};

const roomfactory = async (data) => {
  await db.room.create(data);
};

const tripfactory = async (data) => {
  await db.room.create(data);
};

const locationfactory = async (data) => {
  await db.location.create(data);
};

const requestfactory = async (data) => {
  await db.request.create(data);
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
