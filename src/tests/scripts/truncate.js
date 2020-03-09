
import models from '../../models';

/**
 * Function destroys the tables
 * @returns {object} destroy table
 */
export default async function truncate() {
  return Promise.all((Object.keys(models)).map((key) => {
    if (['sequelize', 'Sequelize'].includes(key)) return null;
    return models[key].destroy({ where: {}, force: true });
  }));
}
