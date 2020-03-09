module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('likes', 'liked', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }),
    queryInterface.addColumn('likes', 'unliked', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    })
  ]),

  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('likes', 'liked'),
    queryInterface.removeColumn('likes', 'unliked')
  ])
};
