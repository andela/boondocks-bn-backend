import express from 'express';
import hotels from '../../controllers/hotels.controller';
import catchErrors from '../../utils/helper';
import fileService from '../../services/files.service';
import { validation } from '../../validation/validation';
import authorize from '../../middlewares/roleAuthorization';
import { verifyUser } from '../../middlewares/checkToken';
import checkHotel from '../../middlewares/checkHotel';

const router = express.Router();

/**
 * @swagger
 *
 * /hotels:
 *   post:
 *     summary: Add new Hotel
 *     description: This allows travel admins to add accomodation facility
 *     tags:
 *       - Accommodation
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *               services:
 *                 type: string
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
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
 *                   id:
 *                     type: integer
 *                   locationId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *                   street:
 *                     type: string
 *                   description:
 *                     type: string
 *                   services:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   createAt:
 *                     type: string
 *     responses:
 *       201:
 *         description: success
 */
router.post(
  '/hotels',
  verifyUser,
  authorize(['travel_administrator', 'super_administrator']),
  fileService.upload('image'),
  validation,
  catchErrors(hotels.createHotel)
);

/**
 * @swagger
 *
 * /hotels/{hotelId}/rooms:
 *   post:
 *     summary: Add Hotel rooms
 *     description: This allows travel admins to add hotel rooms
 *     tags:
 *       - Accommodation
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               cost:
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
 *                   id:
 *                     type: integer
 *                   hotelId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *                   type:
 *                     type: string
 *                   description:
 *                     type: string
 *                   cost:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                   createAt:
 *                     type: string
 *     responses:
 *       201:
 *         description: success
 */
router.post(
  '/hotels/:hotelId/rooms',
  verifyUser,
  authorize(['travel_administrator', 'super_administrator']),
  fileService.upload('image'),
  validation,
  catchErrors(hotels.addRoom),
);

/**
 * @swagger
 *
 * /hotels/:hotelId/like:
 *  patch:
 *    summary: Helps user like or undo dislike accommodation
 *    description: Helps user like or undo like an accommodation and returns liked accommodation
 *    tags:
 *      - Accommodation
 *    produces:
 *      application/json:
 *        properties:
 *          status:
 *            type: string
 *          message:
 *            type: string
 *          data:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                name:
 *                  type: string
 *                description:
 *                  type: integer
 *                street:
 *                   type: string
 *                services:
 *                  type: string
 *                createdAt:
 *                  type: date
 *                likesCount:
 *                  type: integer
 *                unLikesCount:
 *                  type: integer
 *                likes:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      userId:
 *                        type: integer
 *                      user:
 *                        type: object
 *                location:
 *                  type: object
 *                rooms:
 *                  type: object
 *    responses:
 *      200:
 *        description: success
 *      409:
 *        description: Room not available
 *      401:
 *        description: unauthorized
 *      500:
 *        description: exception errors
 */
router.patch(
  '/hotels/:hotelId/like',
  verifyUser,
  checkHotel,
  catchErrors(hotels.like)
);
/**
 * @swagger
 *
 * /hotels/:hotelId/unlike:
 *  patch:
 *    summary: Helps user unlike or undo dislike an accommodation
 *    description: Helps user like or dislike accommodation and returns liked accommodation
 *    tags:
 *      - Accommodation
 *    produces:
 *      application/json:
 *        properties:
 *          status:
 *            type: string
 *          message:
 *            type: string
 *          data:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                name:
 *                  type: string
 *                description:
 *                  type: integer
 *                street:
 *                   type: string
 *                services:
 *                  type: string
 *                createdAt:
 *                  type: date
 *                likesCount:
 *                  type: integer
 *                unLikesCount:
 *                  type: integer
 *                likes:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      userId:
 *                        type: integer
 *                      user:
 *                        type: object
 *                location:
 *                  type: object
 *                rooms:
 *                  type: object
 *    responses:
 *      200:
 *        description: success
 *      409:
 *        description: Room not available
 *      401:
 *        description: unauthorized
 *      500:
 *        description: exception errors
 */

router.patch(
  '/hotels/:hotelId/unlike',
  verifyUser,
  checkHotel,
  catchErrors(hotels.unLike)
);

/**
 * @swagger
 *
 * /hotels/:hotelId:
 *  get:
 *    summary: Gets hotel by ID
 *    description: Retrieves hotel, rooms dislikes, and its likes
 *    tags:
 *      - Accommodation
 *    produces:
 *      application/json:
 *        properties:
 *          status:
 *            type: string
 *          message:
 *            type: string
 *          data:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                name:
 *                  type: string
 *                description:
 *                  type: integer
 *                street:
 *                   type: string
 *                services:
 *                  type: string
 *                createdAt:
 *                  type: date
 *                likesCount:
 *                  type: integer
 *                likes:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      userId:
 *                        type: integer
 *                      user:
 *                        type: object
 *                location:
 *                  type: object
 *                rooms:
 *                  type: object
 *    responses:
 *      200:
 *        description: success
 *      409:
 *        description: Room not available
 *      401:
 *        description: unauthorized
 *      500:
 *        description: exception errors
 */
router.get(
  '/hotel/:hotelId',
  verifyUser,
  checkHotel,
  catchErrors(hotels.getHotel)
);

/**
 * @swagger
 *
 * /hotels:
 *  get:
 *    summary: Gets all the hotels
 *    description: Retrieves hotels and their likes
 *    tags:
 *      - Accommodation
 *    produces:
 *      application/json:
 *        properties:
 *          status:
 *            type: string
 *          message:
 *            type: string
 *          data:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                name:
 *                  type: string
 *                description:
 *                  type: integer
 *                street:
 *                   type: string
 *                services:
 *                  type: string
 *                createdAt:
 *                  type: date
 *                likesCount:
 *                  type: integer
 *                likes:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      userId:
 *                        type: integer
 *                      user:
 *                        type: object
 *                location:
 *                  type: object
 *    responses:
 *      200:
 *        description: success
 *      409:
 *        description: Room not available
 *      401:
 *        description: unauthorized
 *      500:
 *        description: exception errors
 */
router.get(
  '/hotels',
  verifyUser,
  catchErrors(hotels.getAllHotels)
);
export default router;

/**
 * @swagger
 *
 * /api/v1/hotels/most-travelled:
 *   post:
 *     tags:
 *       - Hotels
 *     summary: Get the most visited Hotel
 *     description: Allow user to get the most travelled destination
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Successfully retrieved the most travelled destination
 *       '404':
 *         description: Trips not found
 */
router.get(
  '/hotels/most-travelled',
  verifyUser,
  catchErrors(hotels.getMostVisitedDestination),
);
