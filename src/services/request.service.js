/* eslint-disable prefer-destructuring */
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

const getOneRequest = async (requestId) => {
  const request = await db.request.findOne({
    where: {
      id: requestId
    },
    include: [{
      model: db.trip,
      attributes: ['type', 'reason', 'travelDate', 'returnDate', 'createdAt', 'updatedAt', 'id'],
      include: [{
        model: db.hotel,
        attributes: ['name', 'id'],
        include: [
          { model: db.room,
            attributes: ['id']
          }
        ]
      },
      {
        model: db.booking,
        attributes: ['amount', 'paymentType']
      },
      { model: db.location,
        as: 'going',
        attributes: ['country', 'city', 'id']
      },
      { model: db.location,
        as: 'leaving',
        attributes: ['country', 'city', 'id']
      },
      ]
    },
    {
      model: db.comment,
      include: [{
        model: db.user,
        as: 'author',
        attributes: ['firstName', 'lastName']
      }]
    },
    {
      model: db.user,
      attributes: ['lastName', 'firstName'],
    }
    ]
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
    where: {
      lineManagerId: userId,
    },
    include: [
      {
        model: db.request,
        include: [
          {
            model: db.user,
            attributes: ['lastName', 'firstName'],
          },
          {
            model: db.trip,
            attributes: ['reason'],
          },
        ],
      }],
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

const getManagerRequestByStatus = async (status, userId) => {
  const userRequests = await db.user.findAll({
    where: {
      lineManagerId: userId,
    },
    include: [
      {
        model: db.request,
        where: {
          status,
        },
        include: [
          {
            model: db.user,
            attributes: ['lastName', 'firstName'],
          },
          {
            model: db.trip,
            attributes: ['reason'],
          },
        ],
      }],
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
        id: requestId
      },
    });
    return request;
  }

  throw new ErrorHandler('Please set status to "approved" or "declined"', 400);
};

const getSearchedRequests = async (userId, query) => {
  let { searchString } = query;
  let travelDate, returnDate;

  if (Object.prototype.hasOwnProperty.call(query, 'travelDate') === false) {
    travelDate = new Date('1970-01-01');
  } else {
    travelDate = query.travelDate;
    ({ travelDate } = query);
  }
  if (Object.prototype.hasOwnProperty.call(query, 'returnDate') === false) {
    returnDate = new Date('9999-12-31');
  } else {
    returnDate = query.returnDate;
    ({ returnDate } = query);
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
    JOIN locations AS l
    ON t."leavingFrom"=l."id"
    JOIN locations AS b
    ON t."goingTo"=b."id" 
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
      lower(l."city") SIMILAR TO :searchRegex
      OR lower(l."country") SIMILAR TO :searchRegex
      OR lower(b."city") SIMILAR TO :searchRegex
      OR lower(b."country") SIMILAR TO :searchRegex
    )`;
  }

  const requests = await db.sequelize.query(
    strQuery, {
      replacements: {
        tDate: travelDate,
        rDate: returnDate,
        userId,
        enumQueries,
        searchRegex,
      },
      type: db.sequelize.QueryTypes.SELECT,
    },
  );
  if (requests.length === 0) {
    throw new ErrorHandler('no matching records found', 404);
  }

  return requests;
};

const getSearchedManagerRequests = async (lineManagerId, query) => {
  let { searchString } = query;
  let travelDate, returnDate;

  if (Object.prototype.hasOwnProperty.call(query, 'travelDate') === false) {
    travelDate = new Date('1970-01-01');
  } else {
    travelDate = query.travelDate;
    ({ travelDate } = query);
  }
  if (Object.prototype.hasOwnProperty.call(query, 'returnDate') === false) {
    returnDate = new Date('9999-12-31');
  } else {
    returnDate = query.returnDate;
    ({ returnDate } = query);
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
    JOIN locations AS l
    ON t."leavingFrom"=l."id"
    JOIN locations AS b
    ON t."goingTo"=b."id"
    LEFT JOIN users AS u
    ON r."userId"=u."id"
    WHERE u."lineManagerId"=:lineManagerId
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
      lower(l."city") SIMILAR TO :searchRegex
      OR lower(l."country") SIMILAR TO :searchRegex
      OR lower(b."city") SIMILAR TO :searchRegex
      OR lower(b."country") SIMILAR TO :searchRegex
      OR lower(u."firstName") SIMILAR TO :searchRegex
      OR lower(u."lastName") SIMILAR TO :searchRegex
    )`;
  }

  const requests = await db.sequelize.query(strQuery, {
    replacements: {
      tDate: travelDate,
      rDate: returnDate,
      lineManagerId,
      enumQueries,
      searchRegex,
    },
    type: db.sequelize.QueryTypes.SELECT,
  });
  if (requests.length === 0) {
    throw new ErrorHandler('no matching records found', 404);
  }

  return requests.map(({
    id, status, type, createdAt, updatedAt, reason, firstName, lastName,
  }) => ({
    id,
    status,
    type,
    createdAt,
    updatedAt,
    reason,
    firstName,
    lastName,
  }));
};

const getUserTripsStats = async ({ user, fromDate, req }) => {
  const { userId, role } = user;
  const nowDate = new Date();
  const pastDate = '01-01-1900';

  if (['manager', 'requester'].indexOf(role) === -1) {
    throw new ErrorHandler(`User with role "${role}" cannot access this service!`, 400);
  }

  if (new Date(fromDate).getTime() > nowDate.getTime()) {
    throw new ErrorHandler('\'fromDate\' has to be in the past', 422);
  }

  let statsUserId = userId;

  if (role === 'manager') {
    statsUserId = req.body.userId;

    if (!statsUserId) {
      const userRequests = await db.user.findAll({
        where: {
          lineManagerId: userId,
        },
        include: [
          {
            model: db.request,
            attributes: ['id'],
            where: {
              status: 'approved',
            },
            include: [
              {
                model: db.trip,
                where: fromDate ? {
                  travelDate: {
                    [Op.between]: [fromDate, nowDate],
                  },
                } : { travelDate: {
                  [Op.between]: [pastDate, nowDate],
                }
                },
              },
            ],
          }],
      }, { raw: true });
      const requests = [];
      await userRequests.forEach(userRequest => {
        requests.push(...userRequest.requests);
      });
      return requests;
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

  const requests = await db.request.findAll({
    where: {
      status: 'approved',
      userId: statsUserId,
    },
    include: [
      {
        model: db.trip,
        where: fromDate ? {
          travelDate: {
            [Op.between]: [fromDate, nowDate],
          },
        } : { travelDate: {
          [Op.between]: [pastDate, nowDate],
        } },
      },
    ],
    attributes: []
  }, { raw: true });

  return requests;
};

const getAllRequestsHotels = async () => {
  const { hotel, booking, } = db;

  const bookings = await booking.findAll({
    where: {
      arrivalDate: {
        [Op.lt]: (new Date()).toISOString().split('T')[0],
      },
    },
    include: [
      {
        model: hotel,
        as: 'hotel',
      },
    ],
  });

  return bookings;
};

export {
  createRequest,
  getRequestbyStatus,
  getAllRequest,
  getOneRequest,
  getRequestById,
  getManagerRequest,
  getManagerRequestByStatus,
  updateRequestStatus,
  checkUserBelongsToManager,
  getSearchedRequests,
  getUserTripsStats,
  getAllRequestsHotels,
  getSearchedManagerRequests,
};
