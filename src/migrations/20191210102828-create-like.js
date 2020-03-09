module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('likes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'users'
        },
        key: 'id'
      },
      allowNull: false,
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    hotelId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'hotels'
        },
        key: 'id',
      },
      allowNull: false,
      onDelete: 'cascade',
      onUpdate: 'cascade',
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
  down: (queryInterface) => queryInterface.dropTable('likes')
};
