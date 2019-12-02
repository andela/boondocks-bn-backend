import express from 'express';
import trips from '../../controllers/trips.controller';
import { validateMultiCity, validation } from '../../validation/validation';
import {
  checkForMultiCityRooms,
  checkForRooms,
  checkForRoomsOnUpdate,
} from '../../middlewares/roomsAvailability';
import { verifyUser } from '../../middlewares/checkToken';
import catchErrors from '../../utils/helper';

const router = express.Router();

/**
 * @swagger
 *
 * /trips/oneway:
 *   post:
 *     summary: Request a one way trip
 *     description: This creates a one way trip request
 *     tags:
 *       - Trips
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelId:
 *                 type: integer
 *               type:
 *                 type: string
 *               leavingFrom:
 *                 type: string
 *               goingTo:
 *                 type: string
 *               travelDate:
 *                 type: string
 *               reason:
 *                 type: string
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
 *                   id:
 *                     type: integer
 *                   leavingFrom:
 *                     type: string
 *                   goingTo:
 *                     type: string
 *                   travelDate:
 *                     type: string
 *                   reason:
 *                     type: string
 *                   status:
 *                     type: integer
 *                   updatedAt:
 *                     type: string
 *                   createAt:
 *                     type: string
 *     responses:
 *       201:
 *         description: success
 */

router.post('/trips/oneway', verifyUser, validation, checkForRooms, catchErrors(trips.createTrip));

/**
 * @swagger
 *
 * /trips/return:
 *   post:
 *     summary: Make a return trip
 *     description: This creates a return trip and book required accomodation
 *     tags:
 *       - Trips
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelId:
 *                 type: integer
 *               type:
 *                 type: string
 *               leavingFrom:
 *                 type: string
 *               goingTo:
 *                 type: string
 *               travelDate:
 *                 type: string
 *               returnDate:
 *                 type: string
 *               reason:
 *                 type: string
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
 *                   id:
 *                     type: integer
 *                   leavingFrom:
 *                     type: string
 *                   goingTo:
 *                     type: string
 *                   travelDate:
 *                     type: string
 *                   returnDate:
 *                     type: string
 *                   reason:
 *                     type: string
 *                   hotelId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   createAt:
 *                     type: string
 *     responses:
 *       200:
 *         description: success
 *       409:
 *         description: Room not available
 *       401:
 *         description: unauthorized
 */
router.post('/trips/return', verifyUser, validation, checkForRooms, catchErrors(trips.createTrip));

/**
 * @swagger
 *
 * /trips/multi-city:
 *   post:
 *     summary: Make a multi city request
 *     description: This creates a return multi city trips and book required
 *       accomodation
 *     tags:
 *       - Trips
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 hotelId:
 *                   type: integer
 *                 type:
 *                   type: string
 *                 leavingFrom:
 *                   type: string
 *                 goingTo:
 *                   type: string
 *                 travelDate:
 *                   type: string
 *                 returnDate:
 *                   type: string
 *                 reason:
 *                   type: string
 *                 rooms:
 *                   type: array
 *                   items:
 *                     type: integer
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
 *                   id:
 *                     type: integer
 *                   leavingFrom:
 *                     type: string
 *                   goingTo:
 *                     type: string
 *                   travelDate:
 *                     type: string
 *                   returnDate:
 *                     type: string
 *                   reason:
 *                     type: string
 *                   hotelId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   createAt:
 *                     type: string
 *     responses:
 *       201:
 *         description: Request created
 *       409:
 *         description: Room not available
 *       401:
 *         description: unauthorized
 *       400:
 *         description: Validation error
 */
router.post('/trips/multi-city', verifyUser, validateMultiCity, checkForMultiCityRooms, catchErrors(trips.createMultiCitiesTrip));

/**
 * @swagger
 *
 * /trips/:tripId:
 *   post:
 *     summary: Update trip details
 *     description: This route allows you to update the trip details of an
 *       'open' travel request
 *     tags:
 *       - Trips
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelId:
 *                 type: integer
 *               type:
 *                 type: string
 *               leavingFrom:
 *                 type: string
 *               goingTo:
 *                 type: string
 *               travelDate:
 *                 type: string
 *               returnDate:
 *                 type: string
 *               reason:
 *                 type: string
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
 *                   id:
 *                     type: integer
 *                   leavingFrom:
 *                     type: string
 *                   goingTo:
 *                     type: string
 *                   travelDate:
 *                     type: string
 *                   returnDate:
 *                     type: string
 *                   reason:
 *                     type: string
 *                   hotelId:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   createAt:
 *                     type: string
 *     responses:
 *       200:
 *         description: success
 *       409:
 *         description: you can only edit trips whose request status is open
 *       401:
 *         description: Invalid token, please login
 *       403:
 *         description: you can only edit your own trips
 */
router.patch(
  '/trips/:tripId',
  verifyUser,
  validation,
  catchErrors(checkForRoomsOnUpdate),
  catchErrors(trips.updateTrip)
);

/**
 * @swagger
 *
 * /trips/stats:
 *   post:
 *     summary: Get trip stats for a particular user in the X past timeframe
 *     description: Get trip stats for a particular user in the X past timeframe
 *     tags:
 *       - Trips
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               fromDate:
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
 *                   totals:
 *                     type: integer
 *                   trips:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         leavingFrom:
 *                           type: string
 *                         goingTo:
 *                           type: string
 *                         travelDate:
 *                           type: string
 *                         returnDate:
 *                           type: string
 *                         reason:
 *                           type: string
 *                         hotelId:
 *                           type: integer
 *                         userId:
 *                           type: integer
 *                         status:
 *                           type: string
 *                         updatedAt:
 *                           type: string
 *                         createAt:
 *                           type: string
 *     responses:
 *       200:
 *         description: Retrieved successfully
 *       422:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 */
router.post(
  '/trips/stats',
  verifyUser,
  validation,
  catchErrors(trips.statistics)
);

export default router;
