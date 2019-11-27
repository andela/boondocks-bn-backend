module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('hotels', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    locationId: {
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    street: {
      type: Sequelize.STRING
    },
    services: {
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('hotels')
};
