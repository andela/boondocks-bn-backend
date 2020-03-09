module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('notifications', 'modelName'),
    queryInterface.addColumn(
      'notifications',
      'requestId',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'requests',
          key: 'id',
        },
      }
    ),
    queryInterface.addColumn(
      'notifications',
      'messages',
      {
        allowNull: false,
        type: Sequelize.STRING,
      }
    ),
  ]),
  down: async (queryInterface) => Promise.all([
    queryInterface.removeColumn('notifications', 'requestId'),
    queryInterface.removeColumn('notifications', 'messages'),
  ])
};
