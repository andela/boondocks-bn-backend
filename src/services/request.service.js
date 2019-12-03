import db from '../models';
import ErrorHandler from '../utils/error';

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
    }, {
      model: db.comment
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
    }, {
      model: db.comment
    }]
  });

  return requests;
};

const getOneRequest = async (id) => {
  const request = await db.request.findOne({
    where: {
      id
    },
    include: [{
      model: db.trip
    }, {
      model: db.comment
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

const checkUserBelongsToManager = async (lineManagerId, requestId) => {
  const user = await db.request.findOne({
    where: {
      id: requestId
    },
    include: [{
      model: db.user,
      where: {
        lineManagerId
      }
    }]
  });

  return user;
};

const getManagerRequest = async (userId) => {
  const userRequests = await db.user.findAll({
    attributes: [],
    where: {
      lineManagerId: userId
    },
    include: [{
      model: db.request,
      where: {
        status: 'open'
      },
      include: [{
        model: db.trip
      }]
    }]
  });

  const requests = [];
  await userRequests.forEach(user => {
    requests.push(...user.requests);
  });
  if (requests.length === 0) {
    throw new ErrorHandler('No requests found for Approval', 404);
  }
  return requests;
};

const updateRequestStatus = async (requestId, status) => {
  const RequestStatuses = {
    APPROVED: 'approved',
    DECLINED: 'declined'
  };

  if (status === RequestStatuses.APPROVED || status === RequestStatuses.DECLINED) {
    const request = await db.request.update({ status }, {
      where: {
        id: requestId,
        status: 'open'
      },
    });

    const updatedRequest = request[0] === 0;
    if (updatedRequest) {
      throw new ErrorHandler('Request already updated', 409);
    }
    return request;
  }

  throw new ErrorHandler('Please set status to "approved" or "declined"', 400);
};

export {
  createRequest,
  getRequestbyStatus,
  getAllRequest,
  getOneRequest,
  getRequestById,
  getManagerRequest,
  updateRequestStatus,
  checkUserBelongsToManager
};
