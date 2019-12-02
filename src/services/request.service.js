import db from '../models';
import ErrorHandler from '../utils/error';

const { Sequelize } = db;
const { Op } = Sequelize;

const createRequest = async (userId, type) => {
  const request = await db.request.create(
    {
      userId,
      type,
    },
    {
      returning: true,
    },
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

const getSearchedRequests = async (userId, body) => {
  let { searchString } = body;
  let travelDate, returnDate;

  if (Object.prototype.hasOwnProperty.call(body, 'travelDate') === false) {
    travelDate = new Date('1970-01-01');
  } else {
    travelDate = body.travelDate;
  }
  if (Object.prototype.hasOwnProperty.call(body, 'returnDate') === false) {
    returnDate = new Date('9999-12-31');
  } else {
    returnDate = body.returnDate;
  }

  searchString = searchString.toLowerCase();
  const searchArray = searchString.split(' ');
  const statusEnums = ['open', 'approved', 'declined'];
  let enumQueries = [];

  searchArray.forEach((string) => {
    if (statusEnums.includes(string)) {
      enumQueries.push(string);
    }
  });

  const otherSearchParams = [];
  searchArray.forEach((string) => {
    if (statusEnums.includes(string) === false) {
      otherSearchParams.push(string);
    }
  });

  if (enumQueries.length === 0) {
    enumQueries = ['open', 'approved', 'declined'];
  }

  let searchRegex = [];
  let strQuery = `SELECT * FROM requests AS r
    JOIN trips AS t
    ON r."id" = t."requestId" 
    WHERE r."userId"=:userId
    AND t."travelDate" BETWEEN :tDate AND :rDate
    AND r."status" IN(:enumQueries)`;

  if (otherSearchParams.length > 0) {
    otherSearchParams.forEach((searchItem) => {
      searchRegex.push(searchItem);
    });

    searchRegex = searchRegex.join('|');
    searchRegex = `%(${searchRegex})%`;

    strQuery = `${strQuery}
    AND (
      lower(t."leavingFrom") SIMILAR TO :searchRegex
      OR lower(t."goingTo") SIMILAR TO :searchRegex
    )`;
  }

  const requests = await db.sequelize.query(
    strQuery, {
      replacements: {
        tDate: travelDate, rDate: returnDate, userId, enumQueries, searchRegex
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
  if (requests.length === 0) {
    throw new ErrorHandler('no matching records found', 404);
  }
  return requests;
};

const getUserTripsStats = async ({ user, fromDate, req }) => {
  const { userId, role } = user;

  if (['manager', 'requester'].indexOf(role) === -1) {
    throw new ErrorHandler(`User with role "${role}" cannot access this service!`, 400);
  }

  let statsUserId = userId;

  if (role === 'manager') {
    statsUserId = req.body.userId;

    if (!statsUserId) {
      throw new ErrorHandler('\'userId\' field is required', 422);
    }

    const statsUser = await db.user.findByPk(statsUserId);

    if (!statsUser) {
      throw new ErrorHandler('User not found', 404);
    }

    if (!statsUser.lineManagerId) {
      throw new ErrorHandler('User with no LineManager', 422);
    }

    if (userId !== statsUser.lineManagerId) {
      throw new ErrorHandler('You only see stats of users you manage', 400);
    }
  }

  const nowDate = new Date();

  if (fromDate.getTime() > nowDate.getTime()) {
    throw new ErrorHandler('\'fromDate\' has to be in the past', 422);
  }

  const requests = await db.request.findAll({
    where: {
      status: 'approved',
      userId: statsUserId,
    },
    include: [
      {
        model: db.trip,
        where: {
          travelDate: {
            [Op.between]: [fromDate, nowDate],
          },
        },
      },
    ],
    attributes: []
  }, { raw: true });

  return requests;
};

export {
  createRequest,
  getRequestbyStatus,
  getAllRequest,
  getOneRequest,
  getRequestById,
  getManagerRequest,
  updateRequestStatus,
  checkUserBelongsToManager,
  getSearchedRequests,
  getUserTripsStats,
};
