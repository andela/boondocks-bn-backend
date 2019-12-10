import { Sequelize } from 'sequelize';
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
   * Get hotel with rooms and likes using its id
   *
   * @param {Number} hotelId
   * @param {userId} userId
   * @returns {Object} hotel
   */
  async getHotelById(hotelId, userId) {
    const LIKED = 1;
    const UN_LIKED = 1;
    const hotel = await db.hotel.findOne({
      where: { id: hotelId },
      attributes: [
        'id',
        'name',
        'image',
        'description',
        'street',
        'services',
        'createdAt',
        [Sequelize.literal(`(
            SELECT COUNT(*) FROM likes 
            WHERE likes."hotelId" = hotel."id"
            AND likes."liked" = ${LIKED}
          )`),
        'likesCount'],
        [Sequelize.literal(`(
          SELECT COUNT(*) FROM likes 
          WHERE likes."hotelId" = hotel."id"
          AND likes."unliked" = ${UN_LIKED}
        )`),
        'unLikesCount']
      ],
      include: [{
        model: db.like,
        where: { userId },
        attributes: ['userId', 'liked', 'unliked']
      },
      { model: db.location },
      { model: db.room }
      ],
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

  /**
   * Checks if user liked the hotel
   * @param {Number} hotelId
   * @param {number} userId
   * @returns {Boolean} status
   */
  async hasLiked(hotelId, userId) {
    const liked = await db.like.findOrCreate({ where: { userId, hotelId } });
    return liked[0].liked;
  }

  /**
   * Checks if user unLiked the hotel
   * @param {Number} hotelId
   * @param {number} userId
   * @returns {Boolean} status
   */
  async hasUnLiked(hotelId, userId) {
    const liked = await db.like.findOrCreate({ where: { userId, hotelId } });
    return liked[0].unliked;
  }

  /**
   * Change unlike status
   * @param {Number} hotelId
   * @param {Number} userId
   * @param {Number} status unlike status 0, neutral 1, unliked
   * @returns {Undefined} none
   */
  async setUnLikeStatus(hotelId, userId, status) {
    await db.like.update({ unliked: status }, {
      where: { hotelId, userId }
    });
  }

  /**
   * Change like status
   * @param {Number} hotelId
   * @param {Number} userId
   * @param {Number} status like status 0, neutral 1, liked
   * @returns {Undefined} none
   */
  async setLikeStatus(hotelId, userId, status) {
    await db.like.update({ liked: status }, {
      where: { hotelId, userId }
    });
  }

  /**
   * Get Hotels with likes
   * @param {Number} userId
   * @returns {Object} all hotels
   */
  async getHotels(userId) {
    const LIKED = 1;
    const UN_LIKED = 1;
    const hotels = await db.hotel.findAll({
      attributes: [
        'id',
        'name',
        'image',
        'description',
        'street',
        'services',
        'createdAt',
        [Sequelize.literal(`(
            SELECT COUNT(*) FROM likes 
            WHERE likes."hotelId" = hotel."id"
            AND likes."liked" = ${LIKED}
          )`),
        'likesCount'],
        [Sequelize.literal(`(
          SELECT COUNT(*) FROM likes 
          WHERE likes."hotelId" = hotel."id"
          AND likes."unliked" = ${UN_LIKED}
        )`),
        'unLikesCount']
      ],
      include: [
        {
          model: db.like,
          where: { userId },
          attributes: ['userId', 'liked', 'unliked']
        },
        { model: db.location }
      ],
    });

    return hotels;
  }
}

export default new HotelService();
