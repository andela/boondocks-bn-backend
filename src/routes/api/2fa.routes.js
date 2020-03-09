import express from 'express';
import { verifyUser } from '../../middlewares/checkToken';
import catchErrors from '../../utils/helper';
import twoFAController from '../../controllers/2fa.controller';
import { validation } from '../../validation/validation';

const router = express.Router();
const { totpSetup, totpVerify, totpGet, totpDisable, totpSendTokenText } = twoFAController;

/**
 * @swagger
 *
 * /2fa/totp/setup:
 *   patch:
 *     summary: Set up 2 Factor Authentication TOTP
 *     description: Set up 2 Factor Authentication TOTP
 *     tags:
 *       - TwoFactorAuthentication
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
 *                   twoFAType:
 *                     type: string
 *                   twoFASecret:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   twoFADataURL:
 *                     type: string
 *     responses:
 *       206:
 *         description: You need to set a phoneNumber to activate 2FA with SMS.
 *       200:
 *         TOTP Secret created
 */
router.patch('/2fa/totp/setup', verifyUser, catchErrors(totpSetup));

/**
 * @swagger
 *
 * /2fa/totp/setup:
 *   get:
 *     summary: Get 2 Factor Authentication TOTP status
 *     description: Get 2 Factor Authentication TOTP status
 *     tags:
 *       - TwoFactorAuthentication
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
 *                   twoFAType:
 *                     type: string
 *                   twoFASecret:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   twoFADataURL:
 *                     type: string
 *     responses:
 *       200:
 *         description: TOTP Secret retrieved
 */
router.get('/2fa/totp/setup', verifyUser, catchErrors(totpGet));

/**
 * @swagger
 *
 * /2fa/totp/disable:
 *   patch:
 *     summary: Disable 2 Factor Authentication TOTP feature
 *     description: Disable 2 Factor Authentication TOTP feature
 *     tags:
 *       - TwoFactorAuthentication
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
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA successfully disabled
 */
router.patch('/2fa/totp/disable', verifyUser, catchErrors(totpDisable));

/**
 * @swagger
 *
 * /2fa/totp/verify:
 *   post:
 *     summary: Verify user using 2 Factor Authentication
 *     description: Verify user using 2 Factor Authentication
 *     tags:
 *       - TwoFactorAuthentication
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
 *                   comment:
 *                     type: string
 *                   isVisible:
 *                     type: boolean
 *     responses:
 *       200:
 *         description: Valid TOTP token
 *       400:
 *         description: User doesn't have 2FA enabled.
 */
router.post('/2fa/totp/verify', verifyUser, validation, catchErrors(totpVerify));

/**
 * @swagger
 *
 * /2fa/totp/send-token-text:
 *   POST:
 *     summary: Send token SMS Text to the user
 *     description: Send token SMS Text to the user
 *     tags:
 *       - TwoFactorAuthentication
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
 *                   twoFAType:
 *                     type: string
 *                   twoFASecret:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   tokenData:
 *                     type: object
 *                     properties:
 *                        token:
 *                          type: string
 *                        message:
 *                          type: string
 *     responses:
 *       200:
 *         description: TOTP token send
 */
router.post('/2fa/totp/send-token-text', verifyUser, catchErrors(totpSendTokenText));

export default router;
