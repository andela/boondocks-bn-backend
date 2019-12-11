module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('hotels', [{
    locationId: 1,
    userId: 1,
    name: 'Mariott Hotel',
    description: 'Best hotel',
    street: 'main',
    services: 'all',
    createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
    updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('hotels', null, {})
};
