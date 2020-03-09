module.exports = (sequelize, DataTypes) => {
  const Hotel = sequelize.define('hotel', {
    locationId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    street: DataTypes.STRING,
    description: DataTypes.STRING,
    services: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    average_rating: {
      type: DataTypes.NUMERIC(3, 2),
      defaultValue: 0.00,
      allowNull: false
    }
  }, {});
  Hotel.associate = (models) => {
    Hotel.hasMany(models.booking, {
      allowNull: true,
      foreignKey: 'hotelId',
      onDelete: 'CASCADE',
    });
    Hotel.hasMany(models.trip, {
      foreignKey: 'hotelId',
      onDelete: 'CASCADE',
    });
    Hotel.belongsTo(models.location, {
      allowNull: true,
      foreignKey: 'locationId',
      onDelete: 'CASCADE',
    });
    Hotel.hasMany(models.feedback, {
      foreignKey: 'hotelId',
      onDelete: 'CASCADE',
    });

    Hotel.hasMany(models.like, {
      foreignKey: 'hotelId',
      onDelete: 'CASCADE'
    });

    Hotel.hasMany(models.room, {
      foreignKey: 'hotelId',
      onDelete: 'CASCADE'
    });

    Hotel.hasMany(models.rating, {
      foreignKey: 'hotelId',
      onDelete: 'CASCADE'
    });
  };
  return Hotel;
};
