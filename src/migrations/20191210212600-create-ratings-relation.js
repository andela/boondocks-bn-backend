module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ratings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    hotelId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
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
  down: (queryInterface) => queryInterface.dropTable('ratings')
};
