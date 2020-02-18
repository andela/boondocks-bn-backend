module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('users', 'profilePicture', {
      type: Sequelize.STRING,
    })
  ]),

  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('users', 'profilePicture')
  ])
};
