import db from '../models';

const NotificationService = {
  createNotification: async (notification) => db.notification.create(notification),
  getOneNotification: async (id) => db.notification.findOne({ where: { id }, raw: true }),
  getAllNotification: async (id) => db.notification.findAll({ where: { userId: id }, raw: true }),

};

export default NotificationService;
