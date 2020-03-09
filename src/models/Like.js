module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('like', {
    userId: DataTypes.INTEGER,
    hotelId: DataTypes.INTEGER,
    liked: DataTypes.INTEGER,
    unliked: DataTypes.INTEGER
  }, {});
  Like.associate = (models) => {
    Like.belongsTo(models.hotel, {
      foreignKey: 'hotelId',
      onDelete: 'CASCADE'
    });

    Like.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Like;
};
