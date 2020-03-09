import express from 'express';
import { verifyUser } from '../../middlewares/checkToken';
import { validateSearch } from '../../validation/validation';
import requests from '../../controllers/request.controller';
import getRequestByStatus from '../../middlewares/queryRequestByStatus';
import catchErrors from '../../utils/helper';
import checkRequestLineManger from '../../middlewares/checkRequestLineManager';
import authorize from '../../middlewares/roleAuthorization';

const router = express.Router();

/**
 * @swagger
 *
 * /request:
 *  get:
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
router.get(
  '/requests',
  verifyUser,
  authorize(['requester']),
  catchErrors(getRequestByStatus),
  catchErrors(requests.getAll),
);

/**
 * @swagger
 *
 * /request:
 *  get:
 *    summary: this gets all the requests from a specific user to the Manager
 *
 *    description: Takes the line manager token
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
 *      403:
 *        description: Requires managers only
 *      401:
 *        description: unauthorized
 *      500:
 *        description: exception errors
 */
router.get(
  '/requests/manager',
  verifyUser,
  authorize(['manager']),
  catchErrors(getRequestByStatus),
  catchErrors(requests.getLineManagerRequest),
);

/**
 * @swagger
 *
 * /requests:
 *  get:
 *    summary: this gets single the requests from a specific user
 *    description: Takes the users token
 *    tags:
 *      - Requests
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
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
 *      401:
 *        description: unauthorized
 *      500:
 *        description: error occurred
 */
router.get(
  '/requests/:id',
  verifyUser,
  catchErrors(requests.getOne)
);


/**
 * @swagger
 *
 * /request:
 *  patch:
 *    summary: update users request status using line manager
 *    description: Takes the users token
 *    tags:
 *      - Requests
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *    requestBody:
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                  type: string
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
 *      401:
 *        description: unauthorized
 *      500:
 *        description: error occurred
 *      403:
 *        description: can't access this request
 *      400:
 *        description: invalid inputs
 */
router.patch('/request/:id', verifyUser, authorize(['manager']), catchErrors(checkRequestLineManger), catchErrors(requests.approveRequest));

/**
 * @swagger
 *
 * /search/requests:
 *  post:
 *    security:
 *    summary: this gets searched requests from a specific user
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
 *        description: successfully retrieved search results
 *      404:
 *        description: no matching records found
 */
router.get(
  '/search/requests',
  verifyUser,
  validateSearch,
  catchErrors(requests.searchRequests)
);

export default router;
