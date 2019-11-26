module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('notification', {
    modelName: DataTypes.STRING,
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['new_request', 'request_approved']],
          msg: 'Invalid value',
        },
      },
    },
    isRead: DataTypes.BOOLEAN
  }, {});
  Notification.associate = (models) => {
    Notification.belongsTo(models.user, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
  };
  return Notification;
};
