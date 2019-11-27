import express from 'express';
import { validation } from '../../validation/validation';
import authorize from '../../middlewares/roleAuthorization';
import { verifyUser } from '../../middlewares/checkToken';
import roles from '../../controllers/roles.controller';
import users from '../../controllers/users.controller';
import catchErrors from '../../utils/helper';

const router = express.Router();
/**
 * @swagger
 *
 * /auth/users:
 *   get:
 *     summary: List users
 *     description: Fetches all users registered on the application
 *     tags:
 *       - Super_Administrator/Users
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
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   isVerified:
 *                     type: boolean
 *                   role:
 *                     type: string
 *                   createdAt:
 *                     type: date
 *                   updatedAt:
 *                     type: date
 *     responses:
 *       200:
 *         description: success
 */
router.get(
  '/auth/users',
  verifyUser,
  authorize(['super_administrator']),
  catchErrors(users.fetchAllUsers)
);
/**
 * @swagger
 *
 * /auth/user/role:
 *   patch:
 *     summary: Change role
 *     description: Allow super_administrator to change user's role
 *     tags:
 *       - Super_Administrator/Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               role:
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
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   role:
 *                     type: string
 *     responses:
 *       200:
 *         description: success
 */
router.patch(
  '/auth/user/role',
  verifyUser,
  validation,
  authorize(['super_administrator']),
  catchErrors(roles.changeRole)
);

export default router;
