import express from 'express';
import hotels from '../../controllers/hotels.controller';
import catchErrors from '../../utils/helper';
import fileService from '../../services/files.service';
import { validation } from '../../validation/validation';
import authorize from '../../middlewares/roleAuthorization';
import { verifyUser } from '../../middlewares/checkToken';
import checkHotel from '../../middlewares/checkHotel';
import { checkIsEmailVerified, checkHasStayedAtHotel } from '../../middlewares/checkRateHotel';
import ratings from '../../controllers/ratings.controller';

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
  authorize(['travel_administrator', 'suppliers', 'super_administrator']),
  fileService.upload('image', 'images', 5, ['image/png', 'image/jpg', 'image/jpeg'],
    'Only .png, .jpg and .jpeg formats allowed!'),
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
  authorize(['travel_administrator', 'suppliers', 'super_administrator']),
  fileService.upload('image', 'images', 5, ['image/png', 'image/jpg', 'image/jpeg'],
    'Only .png, .jpg and .jpeg formats allowed!'),
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
  catchErrors(checkHotel),
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
  catchErrors(checkHotel),
  catchErrors(hotels.unLike)
);

/**
 * @swagger
 *
 * /hotel/:hotelId:
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
  catchErrors(checkHotel),
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
  catchErrors(hotels.getAllHotels)
);


/**
 * @swagger
 *
 * /hotels/:hotelId/feedback:
 *   post:
 *     tags:
 *       - Feedback
 *     summary: Make a Feedback
 *     description: Allows a user to make a feedback on accommodation
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: params
 *         name: hotelId
 *       - in: body
 *         name: feedback
 *         schema:
 *           type: object
 *           properties:
 *             feedback:
 *               type: string
 *               example: I liked the service in this hotel...
 *     responses:
 *       '201':
 *         description: Comment posted successfully
 *       '404':
 *         description: Hotel doesn't exist
 */
router.post(
  '/hotels/:hotelId/feedback',
  verifyUser,
  validation,
  catchErrors(hotels.addedFeedback)
);


/**
 * @swagger
 *
 * /hotels/:hotelId/feedback:
 *   get:
 *     tags:
 *       - Feedback
 *     summary: Get all feedback
 *     description: Allows a user to view feedback on accommodation
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: params
 *         name: hotelId
 *     responses:
 *       '201':
 *         description: Feedback retrieved successfully
 *       '404':
 *         description: Hotel doesn't exist
 */
router.get(
  '/hotels/:hotelId/feedback',
  verifyUser,
  authorize(['requester', 'travel_administrator', 'suppliers']),
  catchErrors(hotels.getFeedback)
);

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


/**
 * @swagger
 *
 * /hotels/:hotelId/rating:
 *   post:
 *     summary: Rate a hotel
 *     description: This allows users to post a rating on a hotel they stayed at
 *     tags:
 *       - Accommodation
  *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
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
 *                   userId:
 *                     type: string
 *                   rating:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *     responses:
 *       201:
 *         description: Hotel rated successfully
 */
router.post(
  '/hotels/:hotelId/rating',
  verifyUser,
  checkIsEmailVerified,
  catchErrors(checkHasStayedAtHotel),
  validation,
  catchErrors(ratings.rateHotel)
);

/**
 * @swagger
 *
 * /rating/:ratingId:
 *   patch:
 *     summary: Update hotel rating
 *     description: This allows users to update a rating they posted on a hotel
 *     tags:
 *       - Accommodation
  *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
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
 *                   userId:
 *                     type: string
 *                   rating:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *     responses:
 *       201:
 *         description: Hotel rating updated successfully
 */
router.patch(
  '/rating/:ratingId',
  verifyUser,
  validation,
  catchErrors(ratings.changeHotelRating)
);

/**
 * @swagger
 *
 * /rating/:ratingId:
 *   get:
 *     summary: Get a user's hotel rating
 *     description: This allows fetch a rating they posted on a hotel
 *     tags:
 *       - Accommodation
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
 *                   userId:
 *                     type: string
 *                   rating:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *     responses:
 *       201:
 *         description: Hotel rating fetched successfully
 */
router.get(
  '/rating/:ratingId',
  verifyUser,
  catchErrors(ratings.fetchHotelRating)
);


/**
 * @swagger
 *
 * /rating/:ratingId:
 *   get:
 *     summary: Get all hotel ratings
 *     description: This allows us to fetch all hotel ratings posted by users
 *     tags:
 *       - Accommodation
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
 *                 type: array
 *                 properties:
 *                   id:
 *                     type: integer
 *                   hotelId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   rating:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *     responses:
 *       200:
 *         description: Hotel ratings fetched successfully
 */
router.get(
  '/rating',
  verifyUser,
  catchErrors(ratings.fetchAllHotelRatings)
);

/**
 * @swagger
 *
 * /location:
 *  get:
 *    summary: Gets all locations
 *    description: Retrieves locations with their hotels and the available rooms
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
 *                country:
 *                  type: string
 *                city:
 *                  type: integer
 *                hotels:
 *                   type: string
 *                rooms:
 *                   type: string
 *    responses:
 *      200:
 *        description: success
 *      401:
 *        description: unauthorized
 *      500:
 *        description: exception errors
 */
router.get(
  '/location',
  verifyUser,
  catchErrors(hotels.getAllLocations)
);

export default router;
