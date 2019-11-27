import express from 'express';
import hotels from '../../controllers/hotels.controller';
import catchErrors from '../../utils/helper';
import fileService from '../../services/files.service';
import { validation } from '../../validation/validation';
import authorize from '../../middlewares/roleAuthorization';
import { verifyUser } from '../../middlewares/checkToken';


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
  catchErrors(hotels.addRoom)
);
export default router;
