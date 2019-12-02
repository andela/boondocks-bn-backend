const hash = require('../../utils/hash');

const passwordHash = hash.generateSync('12345678');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [{
    firstName: 'Super',
    lastName: 'Administrator',
    email: 'super@administrator.com',
    password: passwordHash,
    role: 'super_administrator',
    isVerified: true,
    createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
    updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
