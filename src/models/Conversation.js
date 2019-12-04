module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('conversation', {
    message: DataTypes.STRING,
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    }
  }, {});
  Conversation.associate = (models) => {
    Conversation.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Conversation;
};
