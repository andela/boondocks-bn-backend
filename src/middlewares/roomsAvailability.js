import db from '../models';
import Responses from '../utils/response';
import tripService from '../services/Trip.service';
/**
 * Checks if the room is reserved or booked
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} res
 */
const checkForRooms = async (req, res, next) => {
  const { Op } = db.Sequelize;

  const { rooms } = req.body;

  let bookedRooms = await db.room.findAndCountAll({
    where: {
      id: {
        [Op.or]: req.body.rooms
      }
    },
    attributes: ['id']
  });

  bookedRooms = bookedRooms.rows.map(room => room.id);

  if (bookedRooms.length > 0) {
    const invalidRooms = rooms.filter(room => !bookedRooms.includes(room));

    if (invalidRooms.length > 0) {
      return Responses.handleSuccess(409, 'rooms does not exist', res, { invalidRooms });
    }
  }

  if (bookedRooms.length === 0) {
    return Responses.handleSuccess(409, 'rooms does not exist ', res, { rooms });
  }

  const unavailableRooms = await db.room.findAndCountAll({
    where: {
      id: {
        [Op.or]: req.body.rooms
      },
      status: {
        [Op.or]: ['reserved', 'booked']
      }
    },
    attributes: ['id']
  });


  if (unavailableRooms.count > 0) {
    bookedRooms = unavailableRooms.rows.map(room => room.id);
    return Responses.handleSuccess(409, 'rooms already booked', res, { unAvailableRooms: bookedRooms });
  }

  next();
};

/**
 * Checks if the room is reserved or booked
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} res
 */
const checkForMultiCityRooms = async (req, res, next) => {
  const { Op } = db.Sequelize;

  const trips = req.body;

  const rooms = trips.map((item) => item.rooms).flat();
  const unavailableRooms = await db.room.findAndCountAll({
    where: {
      id: {
        [Op.or]: rooms
      },
      status: {
        [Op.or]: ['reserved', 'booked']
      }
    },
    attributes: ['id']
  });

  if (unavailableRooms.count > 0) {
    const bookedRooms = unavailableRooms.rows.map(room => room.id);
    return Responses.handleSuccess(409, 'rooms already booked', res, { unAvailableRooms: bookedRooms });
  }
  next();
};

/**
 * Checks if the room is reserved or booked by another requester
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} res
 */
const checkForRoomsOnUpdate = async (req, res, next) => {
  const trip = await tripService.findTripById(req.params.tripId);
  if (!trip) {
    return Responses.handleError(404, 'no such trip exists', res);
  }
  const { Op } = db.Sequelize;
  const unavailableRooms = await db.room.findAndCountAll({
    where: {
      id: {
        [Op.or]: req.body.rooms
      },
      status: {
        [Op.or]: ['reserved', 'booked']
      },
    },
    include: [{
      model: db.booking,
      where: {
        userId: {
          [Op.ne]: res.locals.user.userId
        }
      }
    }],
    attributes: ['id']
  });
  if (unavailableRooms.count > 0) {
    const bookedRooms = unavailableRooms.rows.map(room => room.id);
    const errMessage = { unAvailableRooms: bookedRooms };
    return Responses.handleSuccess(
      409,
      'room(s) already booked by other requester',
      res,
      errMessage
    );
  }
  next();
};

export { checkForRooms, checkForMultiCityRooms, checkForRoomsOnUpdate };
