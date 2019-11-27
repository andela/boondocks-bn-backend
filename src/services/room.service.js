import db from '../models';

/**
 * room service
 */
class RoomService {
  /**
     * Creates a room
     * @param {Object} params Information about the room
     * @param {Number} params.hotelId roomId for the room
     * @param {String} params.name name of the room
     * @param {String} params.type type the room
     * @param {String} params.image image of the room
     * @param {Number} params.cost cost of the room
     * @param {String} params.status status of the room
     * @returns {Object} room
     */
  async create(params) {
    const room = await db.room.create(params);
    return room;
  }
}

export default new RoomService();
