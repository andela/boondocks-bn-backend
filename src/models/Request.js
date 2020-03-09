module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('request', {
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'open',
      values: [
        'open',
        'declined',
        'approved'
      ]
    },
    userId: DataTypes.INTEGER,
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'single',
      values: [
        'single',
        'multi',
      ]
    }
  }, {});
  Request.associate = (models) => {
    Request.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Request.hasMany(models.trip, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE'
    });
    Request.hasMany(models.comment, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE'
    });
    Request.hasMany(models.notification, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE'
    });
  };
  return Request;
};
