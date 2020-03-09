module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('feedback', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
    feedback: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hotelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
  }, {});
  Feedback.associate = (models) => {
    Feedback.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Feedback.belongsTo(models.hotel, {
      foreignKey: 'hotelId',
      onDelete: 'CASCADE',
    });
  };
  return Feedback;
};
