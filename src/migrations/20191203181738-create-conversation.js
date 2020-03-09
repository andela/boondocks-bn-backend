module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('conversations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER
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
  down: (queryInterface) => queryInterface.dropTable('conversations')
};
