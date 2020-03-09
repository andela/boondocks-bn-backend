module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('notification', {
    userId: DataTypes.INTEGER,
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['new_request', 'request_approved_or_rejected', 'edited_request', 'new_comment']],
          msg: 'Invalid value',
        },
      },
    },
    messages: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: DataTypes.BOOLEAN,
    requestId: DataTypes.INTEGER
  }, {});
  Notification.associate = (models) => {
    Notification.belongsTo(models.user, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
    Notification.belongsTo(models.request, {
      foreignKey: 'requestId',
      targetKey: 'id',
    });
  };
  return Notification;
};
