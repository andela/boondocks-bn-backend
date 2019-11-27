import db from '../models';

/**
 * Hotel service
 */
class HotelService {
  /**
     * Creates a Hotel
     * @param {Object} params Information about hotel
     * @param {Number} params.locationId locationId for the hotel
     * @param {String} params.name name of the hotel
     * @param {String} params.street street for the hotel
     * @param {String} params.description description for the hotel
     * @param {String} params.services services offered by the hotel
     * @returns {Object} hotel
     */
  async create(params) {
    const hotel = await db.hotel.create(params);
    return hotel;
  }

  /**
   * Get hotel using its id
   *
   * @param {Number} hotelId
   * @returns {Object} hotel
   */
  async getHotelById(hotelId) {
    const hotel = await db.hotel.findOne({
      where: {
        id: hotelId
      }
    });

    return hotel;
  }

  /**
   * Checks if the current user is hotel owner
   *
   * @param {*} hotelId
   * @param {*} userId
   * @returns {Boolean} owner
   */
  async isOwner(hotelId, userId) {
    const hotel = await db.hotel.findOne({
      where: {
        id: hotelId
      }
    });

    return hotel.userId === userId;
  }

  /**
   * Checks if hotel exists in a location
   * @param {Number} locationId
   * @param {String} name
   * @returns {Boolean} boolean
   */
  async hotelExist(locationId, name) {
    const hotel = await db.hotel.findOne({
      where: {
        locationId,
        name
      }
    });

    return hotel;
  }
}

export default new HotelService();
