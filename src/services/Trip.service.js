import db from '../models';
import bookingService from './booking.service';
import roomService from './room.service';

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
    let trip;
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

    const objWithHotel = {
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
    };

    const objNoHotel = {
      userId,
      type,
      leavingFrom,
      goingTo,
      travelDate,
      returnDate,
      reason,
      requestId
    };

    if (!hotelId && !rooms) {
      trip = await db.trip.create(objNoHotel);
    } else {
      trip = await db.trip.create(objWithHotel);
      rooms.forEach(async (roomId) => {
        const roomDetails = await db.room.findByPk(roomId);
        const travelDateObj = new Date(travelDate);
        const returnDateObj = new Date(returnDate);
        let amount, duration;

        if (returnDate) {
          duration = Math.round((returnDateObj - travelDateObj) / (24 * 3600 * 1000));
          amount = duration * roomDetails.cost;
        } else {
          duration = 1;
          amount = duration * roomDetails.cost;
        }

        await bookingService.create({
          hotelId,
          userId,
          roomId,
          arrivalDate: travelDate,
          leavingDate: returnDate,
          tripId: trip.id,
          amount,
        });
        await roomService.changeStatus(roomId, 'reserved');
      });
    }
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
