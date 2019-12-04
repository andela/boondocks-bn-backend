import db from '../models';

/**
 * Class trip service, creates trips
 */
class Trip {
  /**
   * creates a single trip
   * @param {object} data
   * @returns {object} returns nothing
   */
  async create(data) {
    const {
      userId,
      hotelId,
      type,
      leavingFrom,
      goingTo,
      travelDate,
      returnDate,
      reason,
      rooms,
      requestId
    } = data;

    const trip = await db.trip.create({
      userId,
      hotelId,
      type,
      leavingFrom,
      goingTo,
      requestId,
      travelDate,
      returnDate,
      reason,
    });

    rooms.forEach(async (room) => {
      await db.booking.create({
        hotelId,
        userId,
        roomId: room,
        tripId: trip.id
      });
      await db.room.update({ status: 'reserved' }, {
        where: {
          id: room
        }
      });
    });
    return trip;
  }

  /**
   * fetches a single trip
   * @param {number} tripId
   * @returns {object} returns trip object or null
   */
  async findTripById(tripId) {
    const trip = await db.trip.findByPk(tripId);
    if (!trip) return null;
    return trip;
  }
}

export default new Trip();
