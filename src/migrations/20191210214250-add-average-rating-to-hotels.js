module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((t) => Promise.all([
    queryInterface.addColumn('hotels', 'average_rating', {
      type: Sequelize.NUMERIC(3, 2),
      defaultValue: 0.00,
      allowNull: false
    }, { transaction: t })
  ])),

  down: (queryInterface) => queryInterface.sequelize.transaction((t) => Promise.all([
    queryInterface.removeColumn('hotels', 'average_rating', { transaction: t })
  ]))
};
