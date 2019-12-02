import express from 'express';
import bookings from '../../controllers/booking.controller';
import catchErrors from '../../utils/helper';
import { verifyUser } from '../../middlewares/checkToken';
import { validation } from '../../validation/validation';
import { checkForRooms } from '../../middlewares/roomsAvailability';

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
  validation,
  checkForRooms,
  catchErrors(bookings.book)
);

export default router;
