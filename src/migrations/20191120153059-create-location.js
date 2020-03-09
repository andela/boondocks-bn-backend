module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('locations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    country: {
      allowNull: false,
      type: Sequelize.STRING
    },
    city: {
      allowNull: false,
      type: Sequelize.STRING
    },
    long: {
      allowNull: true,
      type: Sequelize.FLOAT
    },
    lat: {
      allowNull: true,
      type: Sequelize.FLOAT
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
  down: (queryInterface) => queryInterface.dropTable('locations')
};
