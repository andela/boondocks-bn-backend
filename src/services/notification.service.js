import db from '../models';

const NotificationService = {
  createNotification: async (notification) => db.notification.create(notification),
  getAllNotification: async (id) => db.notification.findAll({ where: { userId: id }, raw: true }),
  markAllAsRead: async (userId) => db.notification.update({ isRead: true }, { where: { userId } })
};

export default NotificationService;
