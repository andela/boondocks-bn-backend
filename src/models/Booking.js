module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('booking', {
    userId: DataTypes.INTEGER,
    hotelId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER,
    tripId: DataTypes.INTEGER,
    arrivalDate: DataTypes.DATE,
    leavingDate: DataTypes.DATE,
    isPaid: DataTypes.BOOLEAN,
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false
    },
    paymentType: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'unpaid',
      values: [
        'paypal',
        'stripe',
        'cash',
        'unpaid'
      ]
    },
  }, {});
  Booking.associate = (models) => {
    Booking.belongsTo(models.user, {
      allowNull: true,
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Booking.belongsTo(models.hotel, {
      allowNull: true,
      foreignKey: 'hotelId',
      onDelete: 'CASCADE'
    });
    Booking.belongsTo(models.room, {
      allowNull: true,
      foreignKey: 'roomId',
      onDelete: 'CASCADE'
    });
    Booking.belongsTo(models.trip, {
      allowNull: true,
      foreignKey: 'tripId',
      onDelete: 'CASCADE'
    });
  };
  return Booking;
};
