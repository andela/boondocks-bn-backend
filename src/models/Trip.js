module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('trip', {
    userId: DataTypes.INTEGER,
    hotelId: DataTypes.INTEGER,
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'one way',
      values: [
        'one way',
        'return',
      ]
    },
    leavingFrom: DataTypes.STRING,
    goingTo: DataTypes.STRING,
    travelDate: DataTypes.DATE,
    returnDate: DataTypes.DATE,
    reason: DataTypes.STRING,
    requestId: DataTypes.INTEGER
  }, {});
  Trip.associate = (models) => {
    Trip.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Trip.belongsTo(models.hotel, {
      foreignKey: 'hotelId',
      onDelete: 'CASCADE'
    });
    Trip.belongsTo(models.request, {
      foreignKey: 'requestId',
      onDelete: 'CASCADE'
    });
  };
  return Trip;
};
