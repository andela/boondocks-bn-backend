import db from '../models';

const NotificationService = {
  createNotification: async (notification) => db.notification.create(notification),
  getAllNotification: async (id) => db.notification.findAll({ where: { userId: id }, raw: true }),

};

export default NotificationService;
