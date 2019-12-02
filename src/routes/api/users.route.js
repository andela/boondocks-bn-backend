import express from 'express';
import users from '../../controllers/users.controller';
import checkForEmail from '../../validation/user.validation';
import { validation } from '../../validation/validation';
import catchErrors from '../../utils/helper';
import { decodeQueryToken, verifyUser } from '../../middlewares/checkToken';

const {
  updateUserInfo,
  getUserProfile,
} = users;

const router = express.Router();

/**
 * @swagger
 *
 * /auth/signup:
 *   post:
 *     security: []
 *     summary: User Signup
 *     description: Creates a new user account
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
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
 *                   token:
 *                     type: string
 *     responses:
 *       201:
 *         description: created
 */
router.post('/auth/signup', validation, checkForEmail, catchErrors(users.createUser));

/**
 * @swagger
 *
 * /auth/verification:
 *  get:
 *    security: []
 *    tags:
 *      - Users
 *    summary: User email verification
 *    description: verifies users acount using an email
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
 *      '500':
 *        description: Error at verification
 *      '401':
 *        description: invalid token
 *      '409':
 *        description: trying to verify again
 *      '200':
 *        description: successfully verified
 */
router.get('/auth/verification', decodeQueryToken, catchErrors(users.verifyAccount));

/**
 * @swagger
 *
 * /auth/signin:
 *   post:
 *     security: []
 *     summary: User SignIn
 *     description: Logs in an existing User
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
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
 *                   token:
 *                     type: string
 *     responses:
 *       200:
 *         description: success
 */
router.post('/auth/signin', validation, catchErrors(users.findUser));

/**
 * @swagger
 *
 * /auth/reverifyUser:
 *  get:
 *    tags:
 *      - Users
 *    summary: User email verification
 *    description: verifies users account using an email
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
 *        name: email
 *        description: user's email
 *        type: string
 *    responses:
 *      '500':
 *        description: Error at verification
 *      '404':
 *        description: email not found
 *      '200':
 *        description: successfully verified
 */
router.get('/auth/reverifyUser', catchErrors(users.resendEmail));

/**
 * @swagger
 *
 * /auth/forgotPassword:
 *  post:
 *    tags:
 *      - Users
 *    summary: User forgot password link
 *    description: Enables the reset password to get the users email so as to reset
 *    produces:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *            message:
 *              type: string
 *    requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *    parameters:
 *      - in: query
 *        name: token
 *        description: token from user email to reset
 *        type: string
 *    responses:
 *      '500':
 *        description: Error at forgot password
 *      '404':
 *        description: email not found
 *      '200':
 *        description: successfully sent reset link
 */
router.post('/auth/forgotPassword', catchErrors(users.forgotPassword));

/**
 * @swagger
 *
 * /auth/resetPassword:
 *  patch:
 *    tags:
 *      - Users
 *    summary: User forgot password link
 *    description: Enables the reset password to get the users email so as to reset
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
 *    requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *    responses:
 *      '500':
 *        description: Error at forgot password
 *      '404':
 *        description: email not found
 *      '200':
 *        description: succesfull sent reset link
 */
router.patch('/auth/resetPassword', validation, decodeQueryToken, catchErrors(users.resetPassword));

/**
 * @swagger
 *
 * /user/update-profile:
 *  patch:
 *    tags:
 *      - Users
 *    summary: Users profile settings
 *    description: User gets a user profile upon successful registration to Barefoot Nomad
 *      and is able to update/edit
 *    operationId: CreateUserProfile
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: user
 *        schema:
 *          type: object
 *          properties:
 *            firstName:
 *              type: string
 *              example: john
 *            lastName:
 *              type: string
 *              example: doe
 *            password:
 *              type: string
 *              example: password
 *            gender:
 *              type: string
 *              example: male
 *            lineManager:
 *              type: string
 *              example: Williams Doe
 *            preferredCurrency:
 *              type: string
 *              example: "$"
 *            preferredLanguage:
 *              type: string
 *              example: English
 *            department:
 *              type: string
 *              example: IT
 *            birthDate:
 *              type: string
 *              example: 14/10/1990
 *            residenceAddress:
 *              type: string
 *              example: 14, Jeremiah Ugwu, Lekki, Lagos
 *            phoneNumber:
 *              type: integer
 *              example: 08012345678
 *    responses:
 *      '201':
 *        description: successful operation
 *      '404':
 *        description: Unsuccessful User not found
 *      '500':
 *        description: Internal Server error
 * */
router.patch('/user/update-profile', verifyUser, validation, catchErrors(updateUserInfo));

/**
 * @swagger
 *
 * /user/:userId:
 *  get:
 *    tags:
 *      - Users
 *    summary: Users profile settings
 *    description: Barefoot Nomad User is able to access their Barefoot Nomad profile
 *    operationId: GetUserProfile
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: userId
 *        in: path
 *        description: ID of user to return a profile
 *        required: true
 *        type: integer
 *        format: int64
 *    responses:
 *      '201':
 *        description: successful operation
 *      '404':
 *        description: Unsuccessful User not found
 *      '500':
 *        description: Internal Server error
 * */
router.get('/user/:userId', verifyUser, catchErrors(getUserProfile));

export default router;
