
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('documents', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    url: {
      allowNull: false,
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    travelAdminId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  down: (queryInterface) => queryInterface.dropTable('documents'),
};
