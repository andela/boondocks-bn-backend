import Responses from '../utils/response';
import db from '../models';
import NotificationService from '../services/notification.service';

/**
 * class for Nofication related operations
 */
class NotificatificationController {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} responses
   */
  async cancelNotification(req, res) {
    const { user } = res.locals;
    if (user.receiveNotification) {
      await db.user.update(
        {
          receiveNotification: false
        },
        { where: { email: user.email } }
      );

      return Responses.handleSuccess(
        200,
        'Receiving notification cancelled',
        res
      );
    }
    return Responses.handleSuccess(
      400,
      'You already unsubscribed from emails',
      res
    );
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} responses
   */
  async userNotifications(req, res) {
    const { userId } = res.locals.user;
    const allNotification = await NotificationService.getAllNotification(userId);
    return Responses.handleSuccess(200, 'Notifications fetched successfully', res, allNotification);
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} responses
   */
  async markAllAsRead(req, res) {
    const { userId } = res.locals.user;
    await NotificationService.markAllAsRead(userId);
    return Responses.handleSuccess(200, 'All notifications marked as read', res);
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} responses
   */
  async markOneAsRead(req, res) {
    const { userId } = res.locals.user;
    const { id } = req.params;
    await NotificationService.markOneAsRead(userId, id);
    return Responses.handleSuccess(200, 'Notifications marked as read', res);
  }
}

export default new NotificatificationController();
