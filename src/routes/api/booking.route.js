import express from 'express';
import bookings from '../../controllers/booking.controller';
import catchErrors from '../../utils/helper';
import { verifyUser } from '../../middlewares/checkToken';
import { validation } from '../../validation/validation';
import { checkForRooms } from '../../middlewares/roomsAvailability';
import authorize from '../../middlewares/roleAuthorization';

const router = express.Router();

/**
 * @swagger
 *
 * /booking:
 *   post:
 *     summary: Book accomodation
 *     description: This allows user to book accomodation
 *     tags:
 *       - Booking
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelId:
 *                 type: integer
 *               arrivalDate:
 *                 type: string
 *               leavingDate:
 *               rooms:
 *                 type: array
 *                 items:
 *                   type: integer
  *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               message:
 *                 type: string
 *               data:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: integer
 *                   hotelId:
 *                     type: string
 *                   arrivalDate:
 *                     type: string
 *                   leavingDate:
 *                     type: string
 *                   bookedRooms:
 *                     type: array
 *                     items:
 *                       type: object
 *     responses:
 *       201:
 *         description: Booking created
 *       409:
 *         description: Room not available
 *       401:
 *         description: unauthorized
 */
router.post(
  '/booking',
  verifyUser,
  authorize(['requester']),
  validation,
  catchErrors(checkForRooms),
  catchErrors(bookings.book)
);

router.get(
  '/booking',
  verifyUser,
  authorize(['travel_administrator', 'requester', 'suppliers']),
  catchErrors(bookings.getBooking)
);

/**
 * @swagger
 *
 * /booking:
 *   post:
 *     summary: Update booking information
 *     description: Allows user to update booking payment information on creating trip request
 *     tags:
 *       - Booking
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPaid:
 *                 type: boolean
 *               paymentType:
 *                 type: string
  *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               message:
 *                 type: string
 *               data:
 *                 type: object
 *                 properties:
 *                   bookingId:
 *                     type: integer
 *                   roomId:
 *                     type: integer
 *                   arrivalDate:
 *                     type: string
 *                   leavingDate:
 *                     type: string
 *                   amount:
 *                     type: string
 *     responses:
 *       201:
 *         description: Booking updated
 *       401:
 *         description: unauthorized
 */
router.patch(
  '/booking/request/:requestId',
  verifyUser,
  validation,
  catchErrors(bookings.updateTripBooking)
);

/**
 * @swagger
 *
 * /booking:
 *   post:
 *     summary: Update booking information
 *     description: Allows user to update booking payment information on booking accomodation
 *     tags:
 *       - Booking
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPaid:
 *                 type: boolean
 *               paymentType:
 *                 type: string
  *     produces:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               message:
 *                 type: string
 *               data:
 *                 type: object
 *                 properties:
 *                   bookingId:
 *                     type: integer
 *                   roomId:
 *                     type: integer
 *                   arrivalDate:
 *                     type: string
 *                   leavingDate:
 *                     type: string
 *                   amount:
 *                     type: string
 *     responses:
 *       201:
 *         description: Booking updated
 *       401:
 *         description: unauthorized
 */
router.patch(
  '/booking/payment',
  verifyUser,
  validation,
  catchErrors(bookings.updateDirectBookings)
);

export default router;
