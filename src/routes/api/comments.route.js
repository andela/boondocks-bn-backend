import express from 'express';
import catchErrors from '../../utils/helper';
import CommentController from '../../controllers/comments.controller';
import { verifyUser } from '../../middlewares/checkToken';
import { validation } from '../../validation/validation';

const router = express.Router();

const { deleteComment, postComment } = CommentController;

/**
 * @swagger
 *
 * /api/v1/requests/:requestId/comment:
 *   post:
 *     tags:
 *       - Comment
 *     summary: Make a Comment
 *     description: Allows a user to make a comment on trip request
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: params
 *         name: requestId
 *       - in: body
 *         name: comment
 *         schema:
 *           type: object
 *           properties:
 *             comment:
 *               type: string
 *               example: I need this trip because...
 *     responses:
 *       '201':
 *         description: Comment posted successfully
 *       '403':
 *         description: User not allowed to comment on this request
 */
router.post('/requests/:requestId/comment', verifyUser, validation, catchErrors(postComment));

/**
 * @swagger
 *
 * /comments/:commentId/delete:
 *   delete:
 *     summary: Delete comment
 *     description: Set the comment to be invisible from the comments thread
 *     tags:
 *       - Comments
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
 *         description: Successfully deleted
 *       404:
 *         description: Comment not found
 *       403:
 *         description: Unauthorized user
 */
router.patch('/comments/:commentId/delete', verifyUser, catchErrors(deleteComment));
export default router;
