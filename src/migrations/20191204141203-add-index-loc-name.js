module.exports = {
  up: (queryInterface) => queryInterface.addConstraint('hotels', ['locationId', 'street', 'name'], {
    type: 'unique',
    name: 'loc_name_index'
  }),
  down: (migration) => {
    migration.sequelize.query('ALTER TABLE hotels DROP CONSTRAINT loc_name_index');
    return migration.removeIndex('hotels', 'loc_name_index');
  }
};
