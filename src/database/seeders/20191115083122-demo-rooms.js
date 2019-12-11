module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('rooms', [{
    hotelId: 1,
    name: 'Executive',
    type: 'Double',
    description: 'Best room',
    cost: 1000,
    status: 'available',
    createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
    updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
  }, {
    hotelId: 1,
    name: 'Standard',
    type: 'Double',
    description: 'Good room',
    cost: 600,
    status: 'available',
    createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
    updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('rooms', null, {})
};
