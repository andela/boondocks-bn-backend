import path from 'path';

import { spawn } from 'child-process-promise';
import config from '../config';
import logger from '../utils/winston';

const spawnOptions = { cwd: path.join(__dirname, '../..'), stdio: 'inherit' };

(async () => {
  // Strip our search params
  const { url } = config.database;

  try {
    await spawn('./node_modules/.bin/sequelize', ['db:seed:all', `--url=${url}`], spawnOptions);
    logger.info('*************************');
    logger.info('Seeding successful');
  } catch (err) {
    logger.info('*************************');
    logger.info('Seeding failed. Error:', err.message);
  }

  process.exit(0);
})();
