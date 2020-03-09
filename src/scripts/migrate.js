import path from 'path';

import { spawn } from 'child-process-promise';
import config from '../config';
import logger from '../utils/winston';

const spawnOptions = { cwd: path.join(__dirname, '../..'), stdio: 'inherit' };

(async () => {
  // Strip our search params
  const { url } = config.database;

  try {
    await spawn('./node_modules/.bin/sequelize', ['db:migrate', `--url=${url}`], spawnOptions);
    logger.info('*************************');
    logger.info('Migration successful');
  } catch (err) {
    logger.info('*************************');
    logger.info('Migration failed. Error:', err.message);
  }

  process.exit(0);
})();
