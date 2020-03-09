module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('rooms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    hotelId: {
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    cost: {
      type: Sequelize.INTEGER
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'available'
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
  down: (queryInterface) => queryInterface.dropTable('rooms')
};
