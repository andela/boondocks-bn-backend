const hash = require('bcrypt');
const config = require('../../config');

const passwordHash = hash.hashSync('12345678', config.HASH_SALT_ROUNDS);

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
  }, {
    firstName: 'Requester',
    lastName: 'User',
    email: 'requester@user.com',
    password: passwordHash,
    role: 'requester',
    isVerified: true,
    createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
    updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
  }, {
    firstName: 'Line',
    lastName: 'Manager',
    email: 'line@manager.com',
    password: passwordHash,
    role: 'manager',
    isVerified: true,
    createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
    updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  {
    firstName: 'travel',
    lastName: 'Admin',
    email: 'travel@administrator.com',
    password: passwordHash,
    role: 'travel_administrator',
    isVerified: true,
    createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
    updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
  }], {}),

  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
