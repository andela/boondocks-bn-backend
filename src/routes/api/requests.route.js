import express from 'express';
import { verifyUser } from '../../middlewares/checkToken';
import requests from '../../controllers/request.controller';
import getRequestByStatus from '../../middlewares/queryRequestByStatus';
import catchErrors from '../../utils/helper';

const router = express.Router();

/**
 * @swagger
 *
 * /request:
 *  get:
 *    security:
 *    summary: this gets all the requests from a specific user
 *    description: Takes the users token and query(optional)
 *    tags:
 *      - Requests
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
 *                status:
 *                  type: string
 *                userId:
 *                  type: integer
 *                type:
 *                   type: string
 *                createdAt:
 *                  type: string
 *                updatedAt:
 *                  type: string
 *                trips:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                      userId:
 *                        type: integer
 *                      hotelId:
 *                        type: integer
 *                      type:
 *                        type: string
 *                      leavingFrom:
 *                        type: string
 *                      goingTo:
 *                        type: string
 *                      travelDate:
 *                        type: string
 *                      returnDate:
 *                        type: string
 *                      reason:
 *                        type: string
 *                      requestId:
 *                        type: integer
 *                      createdAt:
 *                        type: string
 *                      updatedAt:
 *                        type: string
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
router.get('/requests', catchErrors(verifyUser), catchErrors(getRequestByStatus), catchErrors(requests.getAll));

/**
 * @swagger
 *
 * /request:
 *  get:
 *    security:
 *    summary: this gets single the requests from a specific user
 *    description: Takes the users token
 *    tags:
 *      - Requests
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
 *                status:
 *                  type: string
 *                userId:
 *                  type: integer
 *                type:
 *                   type: string
 *                createdAt:
 *                  type: string
 *                updatedAt:
 *                  type: string
 *                trips:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                      userId:
 *                        type: integer
 *                      hotelId:
 *                        type: integer
 *                      type:
 *                        type: string
 *                      leavingFrom:
 *                        type: string
 *                      goingTo:
 *                        type: string
 *                      travelDate:
 *                        type: string
 *                      returnDate:
 *                        type: string
 *                      reason:
 *                        type: string
 *                      requestId:
 *                        type: integer
 *                      createdAt:
 *                        type: string
 *                      updatedAt:
 *                        type: string
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
router.get('/requests/:id', catchErrors(verifyUser), catchErrors(requests.getOne));

export default router;
