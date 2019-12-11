import express from 'express';
import notification from '../../controllers/notification.controller';
import catchErrors from '../../utils/helper';
import { decodeQueryToken, verifyUser } from '../../middlewares/checkToken';


const route = express.Router();

/**
 * @swagger
 *
 * /notification/stopNotification:
 *  patch:
 *    tags:
 *      - Notifications
 *    summary: User to opt out of receiving notification
 *    produces:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *            message:
 *              type: string
 *    parameters:
 *      - in: query
 *        name: token
 *        description: user's token for verification
 *        type: string
 *    responses:
 *      '403':
 *        description: invalid token
 *      '200':
 *        description: opted-out of notification system
 */
route.patch('/notification/stopNotification', decodeQueryToken, catchErrors(notification.cancelNotification));
/**
 * @swagger
 *
 * /notification:
 *  get:
 *    summary: lineManager can get all travel request notification initiated from his direct report
 *    tags:
 *      - Notifications
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
 *                modelName:
 *                  type: string
 *                type:
 *                  type: integer
 *                isRead:
 *                   type: string
 *                createdAt:
 *                  type: string
 *                updatedAt:
 *                  type: string
 *                userId:
 *                  type: integer
 *    responses:
 *      200:
 *        description: success
 *      401:
 *        description: Invalid Token
 */
route.get('/notification', verifyUser, catchErrors(notification.userNotifications));
/**
 * @swagger
 *
 * /auth/markAsRead:
 *  patch:
 *    tags:
 *      - Notifications
 *    summary: User should be able to mark all notifications as read
 *    produces:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *            message:
 *              type: string
 *    parameters:
 *      - in: query
 *        name: token
 *        description: user's token for verification
 *        type: string
 *    responses:
 *      '403':
 *        description: invalid token
 *      '200':
 *        description: all notification marked as read
 */
route.patch('/markAsRead', verifyUser, catchErrors(notification.markAllAsRead));

export default route;
