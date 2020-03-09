module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'remember',
    {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'users',
    'remember',
  )
};
