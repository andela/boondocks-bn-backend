import db from '../../models';

const userfactory = async (data) => {
  const user = await db.user.create(data);
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

export {
  userfactory,
  hotelfactory,
  roomfactory,
  tripfactory,
  requestfactory,
  locationfactory
};
