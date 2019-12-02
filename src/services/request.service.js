import db from '../models';

const createRequest = async (userId, type) => {
  const request = await db.request.create(
    {
      userId, type
    },
    {
      returning: true,
    }
  );
  return request.id;
};

const getRequestbyStatus = async (status, userId) => {
  const requests = await db.request.findAll({
    where: {
      userId,
      status
    },
    include: [{
      model: db.trip
    }]
  });
  return requests;
};

const getAllRequest = async (userId) => {
  const requests = await db.request.findAll({
    where: {
      userId
    },
    include: [{
      model: db.trip
    }]
  });

  return requests;
};

const getOneRequest = async (userId, id) => {
  const request = await db.request.findOne({
    where: {
      userId,
      id
    },
    include: [{
      model: db.trip
    }]
  });

  return request;
};

const getRequestById = async (requestId) => {
  const request = await db.request.findOne({
    where: {
      id: requestId
    }
  });

  return request;
};

export {
  createRequest,
  getRequestbyStatus,
  getAllRequest,
  getOneRequest,
  getRequestById
};
