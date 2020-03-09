module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('comment', {
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {});
  Comment.associate = (models) => {
    Comment.belongsTo(models.request, {
      foreignKey: 'requestId',
      as: 'comments',
      timestamps: false
    });
    Comment.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'author',
      timestamps: false
    });
  };
  return Comment;
};
