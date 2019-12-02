module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('bookings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER
    },
    hotelId: {
      type: Sequelize.INTEGER
    },
    roomId: {
      type: Sequelize.INTEGER
    },
    tripId: {
      type: Sequelize.INTEGER
    },
    arrivalDate: {
      type: Sequelize.DATE
    },
    leavingDate: {
      type: Sequelize.DATE
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
  down: (queryInterface) => queryInterface.dropTable('bookings')
};
