module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('location', {
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    long: DataTypes.FLOAT,
    lat: DataTypes.FLOAT
  }, {});
  Location.associate = (models) => {
    Location.hasMany(models.hotel, {
      foreignkey: 'locationId',
      onDelete: 'CASCADE'
    });
  };
  return Location;
};
