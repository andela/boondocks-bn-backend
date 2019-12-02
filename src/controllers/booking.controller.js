import Responses from '../utils/response';
import bookingService from '../services/booking.service';
import roomService from '../services/room.service';
import db from '../models';

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
      const booking = await bookingService.create({
        hotelId,
        userId,
        arrivalDate,
        leavingDate,
        roomId
      });
      const room = await roomService.changeStatus(roomId, 'reserved');

      return {
        bookingId: booking.id,
        room: await db.room.findOne({ where: { id: room } })
      };
    });

    const bookedRooms = await Promise.all(bookings);

    book.bookedRooms = bookedRooms;
    return Responses.handleSuccess(201, 'Accomodation successfully booked', res, book);
  }
}

export default new Bookings();
