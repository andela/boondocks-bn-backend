import express from 'express';
import notification from '../../controllers/notification.controller';
import catchErrors from '../../utils/helper';
import { decodeQueryToken, verifyUser } from '../../middlewares/checkToken';


const route = express.Router();

route.patch('/notification/stopNotification', decodeQueryToken, catchErrors(notification.cancelNotification));
/**
 * @swagger
 *
 * /:
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

export default route;
