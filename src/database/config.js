// configures the database urls according to the environment
const config = require('../config');

module.exports = {
  url: config.database.url,
  dialect: 'postgress',
};
