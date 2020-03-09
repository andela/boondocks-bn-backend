module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('trips', {
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
      allowNull: true,
      type: Sequelize.INTEGER
    },
    type: {
      type: Sequelize.ENUM,
      allowNull: false,
      defaultValue: 'one way',
      values: [
        'one way',
        'return'
      ]
    },
    leavingFrom: {
      type: Sequelize.STRING
    },
    goingTo: {
      type: Sequelize.STRING
    },
    travelDate: {
      type: Sequelize.DATE
    },
    returnDate: {
      type: Sequelize.DATE
    },
    reason: {
      type: Sequelize.STRING
    },
    requestId: {
      allowNull: false,
      type: Sequelize.INTEGER,
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
  down: (queryInterface) => queryInterface.dropTable('trips')
};
