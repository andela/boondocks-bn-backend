module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .changeColumn('conversations', 'message', {
      type: Sequelize.TEXT,
      allowNull: false
    }),

  down: (queryInterface, Sequelize) => queryInterface
    .changeColumn('conversations', 'message', {
      type: Sequelize.STRING,
      allowNull: false
    })
};
