import Responses from '../utils/response';
import bookingService from '../services/booking.service';
import roomService from '../services/room.service';
import hotelService from '../services/hotel.service';
import db from '../models';
import payWithStripe from '../services/stripe';

/**
 * Bookings controller
 */
class Bookings {
  /**
     * Book an accomodation
     *
     * @param {Object} req request
     * @param {Object} res response
     * @returns {Object} response
     */
  async book(req, res) {
    const {
      hotelId,
      arrivalDate,
      leavingDate,
      rooms
    } = req.body;

    const { userId } = res.locals.user;

    const book = {
      userId,
      hotelId,
      arrivalDate,
      leavingDate
    };
    const bookings = rooms.map(async (roomId) => {
      const roomDetails = await db.room.findByPk(roomId);
      const arrivalDateObj = new Date(arrivalDate);
      const leavingDateObj = new Date(leavingDate);
      const duration = Math.round((leavingDateObj - arrivalDateObj) / (24 * 3600 * 1000));
      const amount = duration * roomDetails.cost;

      const booking = await bookingService.create({
        hotelId,
        userId,
        arrivalDate,
        leavingDate,
        roomId,
        amount
      });

      const room = await roomService.changeStatus(roomId, 'reserved');
      const hotel = await hotelService.getHotelById(hotelId, userId);

      return {
        bookingId: booking.id,
        bookingDetails: booking,
        hotelDetails: { name: hotel.name },
        room: await db.room.findOne({ where: { id: room } })
      };
    });

    const bookedRooms = await Promise.all(bookings);

    book.bookedRooms = bookedRooms;
    return Responses.handleSuccess(201, 'Accommodation successfully booked', res, book);
  }

  /**
     * Retrieves all Bookings
     *
     * @param {Object} req request
     * @param {Object} res response
     * @returns {Object} response
     */
  async getBooking(req, res) {
    const { userId, role } = res.locals.user;
    const bookings = await bookingService.getAllBookings({
      ...role === 'requester' && { userId },
      ...role === 'travel_administrator' && { travelAdminId: userId },
      ...role === 'suppliers' && { travelAdminId: userId },
    });
    return Responses.handleSuccess(200, 'Bookings retrieved successfully', res, bookings);
  }

  /**
     * Retrieves all Bookings
     *
     * @param {Object} req request
     * @param {Object} res response
     * @returns {Object} response
     */
  async updateTripBooking(req, res) {
    const { userId } = res.locals.user;
    const { requestId } = req.params;
    const { isPaid, paymentType } = req.body;
    if (paymentType === 'stripe') {
      payWithStripe(req, res);
    }

    const updatedBookings = await bookingService.updateTripBookingFunc({
      userId, requestId, isPaid, paymentType
    });
    return Responses.handleSuccess(200, 'Bookings updated successfully', res, updatedBookings[0]);
  }

  /**
     * Retrieves all Bookings
     *
     * @param {Object} req request
     * @param {Object} res response
     * @returns {Object} response
     */
  async updateDirectBookings(req, res) {
    const { userId } = res.locals.user;
    const { isPaid, paymentType, bookingIds } = req.body;
    if (paymentType === 'stripe') {
      payWithStripe(req, res);
    }

    const updatedBookings = await bookingService.updateDirectBookingFunc({
      userId, isPaid, paymentType, bookingIds
    });
    return Responses.handleSuccess(200, 'Bookings updated successfully', res, updatedBookings[0]);
  }
}

export default new Bookings();
