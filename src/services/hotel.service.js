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
        'average_rating',
        'services',
        'userId',
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
        attributes: ['userId', 'liked', 'unliked']
      },
      { model: db.location },
      { model: db.room },
      {
        model: db.rating,
        where: { userId },
        required: false
      }
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
  async getHotels() {
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
        'average_rating',
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
          attributes: ['userId', 'liked', 'unliked']
        },
        { model: db.location }
      ],
    });

    return hotels;
  }

  /**
   * Get most travelled destinations
   * @param {Array} arr
   * @returns {Array} hotels
   */
  async mostTravelled(arr) {
    const { hotel } = db;
    const { Op } = Sequelize;
    const mostTravelled = await hotel.findAll({
      where: {
        id: {
          [Op.in]: arr,
        },
      },
    });

    return mostTravelled;
  }

  /**
   * Get locations with hotels
   * @returns {Array} locations
   */
  async getLocationsWithHotels() {
    const locations = await db.location.findAll({
      include: [
        {
          model: db.hotel,
          required: true,
          include: [
            {
              model: db.room,
              where: { status: 'available' }
            }
          ]
        }
      ],
    });
    return locations;
  }

  /**
   * Get locations
   * @returns {Array} locations
   */
  async getLocations() {
    const locations = await db.location.findAll();
    return locations;
  }

  /**
   * Get Feedback
   * @returns {Array} locations
   */
  async getFeedback({ userId, travelAdminId, hotelId }) {
    const whereOptions = userId ? 'WHERE f."userId"=:id' : 'WHERE h."userId"=:id';

    const query = `SELECT u."firstName", u."lastName", f.feedback, f.id
    FROM feedbacks AS f
    JOIN hotels as h
    ON f."hotelId" = h.id 
    JOIN users as u
    ON f."userId" = u.id 
    ${whereOptions}
    AND f."hotelId"=:hotelId
    ORDER BY f."createdAt" DESC`;

    return db.sequelize.query(
      query, {
        replacements: {
          id: userId || travelAdminId,
          hotelId,
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    );
  }
}

export default new HotelService();
