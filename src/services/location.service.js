import db from '../models';

/**
 * location service
 */
class LocationService {
  /**
     * Creates a location
     * @param {Object} params Information about the location
     * @param {String} params.country
     * @param {String} params.city
     * @returns {Object} location
     */
  async create(params) {
    const location = await db.location.findOrCreate({
      where: { country: params.country, city: params.city },
      defaults: params
    });
    return location[0];
  }
}

export default new LocationService();
