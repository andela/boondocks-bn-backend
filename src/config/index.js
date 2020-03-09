/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const merge = require('lodash.merge');
const dotenv = require('dotenv');
const config = require('./env/default');


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  let localConfig = {};

  try {
    // The environment file might not exist
    localConfig = require(`./env/${config.env}`);
    localConfig = localConfig || {};
  } catch (err) {
    localConfig = {};
  }
  // merge the config files
  // localConfig will override defaults
  merge(config, localConfig);
}

module.exports = config;
