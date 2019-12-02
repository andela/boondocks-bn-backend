import db from '../models';

/**
 * Accomodation booking service
 */
class BookingService {
  /**
     * Create a new booking
     *
     * @param {Object} params booking information
     * @param {Number} params.hotelId hotel ID
     * @param {Number} params.userId user ID
     * @param {Number} params.roomId booked room
     * @param {String} params.leavingDate leaving date
     * @param {String} params.returnDate leaving date
     * @param {Number} params.tripId trip
     * @returns {Object} booking
     */
  async create(params) {
    const {
      hotelId,
      userId,
      arrivalDate,
      leavingDate,
      roomId,
      tripId,
    } = params;

    const booking = await db.booking.create({
      hotelId,
      userId,
      arrivalDate,
      leavingDate,
      roomId,
      tripId
    });

    return booking;
  }
}

export default new BookingService();
