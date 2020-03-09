module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(
      'feedbacks',
      'userId'
    ),
    queryInterface.removeColumn(
      'feedbacks',
      'hotelId'
    ),
    queryInterface.addColumn(
      'feedbacks',
      'userId',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        },
      }
    ),
    queryInterface.addColumn(
      'feedbacks',
      'hotelId',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'hotels',
          key: 'id',
        },
      }
    )
  ]),

  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn(
      'feedbacks',
      'userId'
    ),
    queryInterface.removeColumn(
      'feedbacks',
      'hotelId'
    ),
  ])
};
