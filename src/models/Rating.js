module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define('rating', {
    hotelId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }
  }, {});
  Rating.associate = (models) => {
    Rating.belongsTo(models.hotel, {
      foreignKey: 'hotelId',
      onDelete: 'CASCADE'
    });
    Rating.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Rating;
};
