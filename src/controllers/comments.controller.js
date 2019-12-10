import Responses from '../utils/response';
import CommentService from '../services/Comment.service';
import NotificationService from '../services/notification.service';
import NotificationUtil from '../utils/notification.util';

const { postRequestComment, deleteCommentById } = CommentService;

/**
 * Comments controller Class
 */
class CommentsController {
  /**
   * @name postComment
   * @description Allows a user post a comment
   * @param {object} req The request object
   * @param {object} res The response object
   * @returns {object} response
   */
  async postComment(req, res) {
    const { userId } = res.locals.user;
    const { comment } = req.body;
    const { requestId } = req.params;

    const commentData = await postRequestComment(userId, requestId, comment);

    const notification = await NotificationService.createNotification({
      requestId,
      messages: 'New comment posted on your request',
      type: 'new_comment',
      userId: commentData.user,
    });
    NotificationUtil.echoNotification(req, notification, 'new_comment', commentData.user);

    Responses.handleSuccess(201, 'Comment posted successfully', res, commentData);
  }

  /**
   * deleteComment
   * @param {*} req
   * @param {*} res
   * @returns {object} Successfully deleted
   */
  async deleteComment(req, res) {
    const { commentId } = req.params;
    const { userId } = res.locals.user;

    const deletedComment = await deleteCommentById(commentId, userId);

    Responses.handleSuccess(200, 'Comment deleted successfully!', res, deletedComment);
  }
}

export default new CommentsController();
