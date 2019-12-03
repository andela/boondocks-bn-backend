import db from '../models';
import AppError from '../utils/error';

/**
 * Class Comment services creates a middleware
 */
class CommentService {
  /**
   * findUserByEmail - used to get user from database by email
   * @param {string} userId - email of the user
   * @param {string} requestId - email of the user
   * @param {string} comment - email of the user
   * @returns {object} user data from database
   */
  async postRequestComment(userId, requestId, comment) {
    const requestData = await db.request.findOne({ where: { id: requestId } });


    if (!requestData) {
      throw new AppError('request resource not found', 404);
    }

    const request = requestData.dataValues;

    const userLineManagerData = await db.user.findOne({
      where: { id: request.userId },
      attributes: ['lineManagerId']
    });

    const lineManagerId = userLineManagerData && userLineManagerData.dataValues.lineManagerId;

    if (userId !== lineManagerId && userId !== request.userId) {
      throw new AppError('Unauthorised: you are not authorised to perform this operation', 403);
    }

    // eslint-disable-next-line no-return-await
    return await db.comment.create({
      userId,
      comment,
      requestId
    });
  }

  /**
   * deleteCommentById - used to get user from database by email
   * @param {string} id - id of the comment
   * @param {string} userId - id of the comment
   * @returns {object} user data from database
   */
  async deleteCommentById(id, userId) {
    const comment = await db.comment.findOne({
      where: { id },
      attributes: ['isVisible']
    });

    if (!comment) {
      throw new AppError('Entity not found', 404);
    }

    if (comment && !comment.isVisible) {
      throw new AppError('Not authorized: entity already deleted', 403);
    }

    const commentToDelete = await db.comment.findOne({
      where: { id },
      attributes: ['userId']
    });

    if (commentToDelete.userId !== userId) {
      throw new AppError('Not authorized: only the comment author can delete the comment', 403);
    }

    const deletedCommentData = await db.comment.update({ isVisible: false }, {
      where: { id },
      returning: true,
      plain: true
    });


    return deletedCommentData[1];
  }
}

export default new CommentService();
