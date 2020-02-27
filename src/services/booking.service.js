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
      amount,
    } = params;

    const booking = await db.booking.create({
      hotelId,
      userId,
      arrivalDate,
      leavingDate,
      roomId,
      tripId,
      amount
    });

    return booking;
  }

  // eslint-disable-next-line require-jsdoc
  async getAllBookings({ userId, travelAdminId }) {
    const whereOptions = userId ? 'WHERE b."userId"=:id' : 'WHERE h."userId"=:id';

    const query = `SELECT b.id, r.id as "roomId", 
    r.status as "roomStatus", u."firstName", u."lastName", 
    b."arrivalDate", b."leavingDate", b."createdAt", 
    h.name as hotel, r.name as room, h.id as "hotelId"
    FROM bookings AS b
    JOIN  users AS u
    ON u."id" = b."userId"
    JOIN rooms AS r
    ON r."id"=b."roomId"
    JOIN hotels AS h
    ON h."id" = r."hotelId" 
    ${whereOptions}
    ORDER BY b."createdAt" DESC
    `;

    return db.sequelize.query(
      query, {
        replacements: {
          id: userId || travelAdminId
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    );
  }

  /**
     * Create get booking details on trip creation
     *
     * @param {Number} requestId trip
     * @returns {Object} booking
     */
  async getRequestBookingDetails(requestId) {
    const query = `SELECT b.id, b."arrivalDate", b."leavingDate", r.image as "roomImage",
      b.amount as "bookingAmount", b."createdAt", h.name as "hotelName",
      r.name as "roomName", r.cost as "roomUnitCost"
      FROM bookings AS b
      JOIN rooms AS r
      ON r.id = b."roomId"
      JOIN hotels AS h
      ON h.id = r."hotelId" 
      JOIN trips AS t
      ON t.id = b."tripId"
      JOIN requests AS q
      ON q.id = t."requestId" 
      WHERE q.id = :requestId
      ORDER BY b."createdAt" DESC`;

    return db.sequelize.query(
      query, {
        replacements: {
          requestId
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    );
  }

  /**
     * Update booking details on trip creation
     *
     * @param {Object} params trip
     * @returns {Object} booking
     */
  async updateTripBookingFunc(params) {
    const { requestId, userId, isPaid, paymentType } = params;

    const query = `UPDATE bookings b
    SET "isPaid" = :isPaid,
        "paymentType" = :paymentType
    FROM trips t,
         requests r
    WHERE "b"."tripId" = t.id
      AND r.id = "t"."requestId"
      AND r.id = :requestId
      AND "r"."userId" = :userId
    RETURNING b.id, "isPaid", "paymentType"`;

    return db.sequelize.query(
      query, {
        replacements: {
          isPaid, paymentType, requestId, userId
        }
      }
    );
  }

  /**
     * Update booking details on direct booking
     *
     * @param {Object} params trip
     * @returns {Object} booking
     */
  async updateDirectBookingFunc(params) {
    const { bookingIds, userId, isPaid, paymentType } = params;

    const query = `UPDATE bookings b
      SET "isPaid" = :isPaid,
          "paymentType" = :paymentType
      WHERE b.id IN(:bookingIds)
      AND "b"."userId" = :userId
      RETURNING b.id, "isPaid", "paymentType"`;

    return db.sequelize.query(
      query, {
        replacements: {
          isPaid, paymentType, bookingIds, userId
        }
      }
    );
  }
}

export default new BookingService();
