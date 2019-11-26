module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'receiveNotification', {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }),
  down: (queryInterface) => queryInterface.removeColumn('users', 'receiveNotification')
};
