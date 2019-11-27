module.exports = (sequelize, DataTypes) => {
  const Hotel = sequelize.define('hotel', {
    locationId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    street: DataTypes.STRING,
    description: DataTypes.STRING,
    services: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  Hotel.associate = (models) => {
    Hotel.hasMany(models.booking, {
      foreignkey: 'hotelId',
      onDelete: 'CASCADE'
    });
    Hotel.hasMany(models.trip, {
      foreignkey: 'hotelId',
      onDelete: 'CASCADE'
    });
    Hotel.belongsTo(models.location, {
      foreignkey: 'locationId',
      onDelete: 'CASCADE'
    });
  };
  return Hotel;
};
