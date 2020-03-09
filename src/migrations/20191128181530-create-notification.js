module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('notifications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    modelName: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING,
      validate: {
        isIn: {
          args: [['new_request', 'request_approved']],
          msg: 'Invalid value',
        },
      },
    },
    isRead: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: 'integer',
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('notifications')
};
