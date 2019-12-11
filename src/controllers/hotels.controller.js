import hotelService from '../services/hotel.service';
import locationService from '../services/location.service';
import filesService from '../services/files.service';
import Responses from '../utils/response';
import roomService from '../services/room.service';
/**
 * Class for accomodation facilities
 */
class Hotel {
  /**
     * Creates hotel
     * @param {*} req
     * @param {*} res
     * @returns {Object} response
     */
  async createHotel(req, res) {
    const {
      name,
      description,
      services,
      street,
      city,
      country
    } = req.body;

    const { userId } = res.locals.user;
    const location = await locationService.create({ country, city });

    const locationId = location.id;

    const hotelExist = await hotelService.hotelExist(locationId, name);
    if (hotelExist) {
      return Responses.handleError(409, 'Hotel already exists in a location', res);
    }

    let image = '';
    if (req.file !== undefined) {
      const {
        filename,
        path
      } = req.file;

      image = await filesService.s3Upload(path, filename, 'hotels');
    }

    const hotel = await hotelService.create({
      locationId,
      userId,
      name,
      image,
      street,
      description,
      services
    });

    return Responses.handleSuccess(201, 'Hotel added successfully', res, hotel);
  }

  /**
   * Add a room to hotel
   * @param {*} req
   * @param {*} res
   * @returns {Object} response
   */
  async addRoom(req, res) {
    const {
      name,
      type,
      description,
      cost,
    } = req.body;

    const { hotelId } = req.params;

    let image = '';

    const { userId } = res.locals.user;

    const owner = await hotelService.isOwner(hotelId, userId);

    if (!owner) {
      return Responses.handleError(403, 'You don\'t have edit access to this hotel', res);
    }

    if (req.file !== undefined) {
      const {
        filename,
        path
      } = req.file;

      image = await filesService.s3Upload(path, filename, 'rooms');
    }
    const status = 'available';


    const room = await roomService.create({
      hotelId,
      name,
      image,
      type,
      description,
      cost,
      status
    });

    return Responses.handleSuccess(201, 'Room added successfully', res, room);
  }

  /**
   * Get all the hotels with likes
   * @param {*} req
   * @param {*} res
   * @returns {Object} All hotels
   */
  async getAllHotels(req, res) {
    const { userId } = res.locals.user;
    const hotels = await hotelService.getHotels(userId);
    return Responses.handleSuccess(200, 'Hotels retrieved successfully', res, hotels);
  }

  /**
   * Get hotel with likes and rooms
   * @param {*} req
   * @param {*} res
   * @returns {Object} hotel
   */
  async getHotel(req, res) {
    const { hotelId } = req.params;
    const { userId } = res.locals.user;
    const hotel = await hotelService.getHotelById(hotelId, userId);
    return Responses.handleSuccess(200, 'hotel retrieved successfully', res, hotel);
  }

  /**
   * like or undo like on accommodation
   * @param {*} req
   * @param {*} res
   * @returns {Object} response
   */
  async like(req, res) {
    const LIKED = 1;
    const NEUTRAL = 0;

    const { hotelId } = req.params;
    const { userId } = res.locals.user;

    const hasLiked = await hotelService.hasLiked(hotelId, userId);

    let action;
    switch (hasLiked) {
      case LIKED:
        action = 'Undo like';
        await hotelService.setLikeStatus(hotelId, userId, NEUTRAL);
        break;
      case NEUTRAL:
        action = 'Like';
        await hotelService.setLikeStatus(hotelId, userId, LIKED);
        break;
    }

    const hasUnLiked = await hotelService.hasUnLiked(hotelId, userId);

    if (hasUnLiked) {
      await hotelService.setUnLikeStatus(hotelId, userId, NEUTRAL);
    }

    const hotel = await hotelService.getHotelById(hotelId, userId);

    return Responses.handleSuccess(200, `${action} successful`, res, hotel);
  }

  /**
   * unlike or undo unlike on accommodation
   * @param {*} req
   * @param {*} res
   * @returns {Object} response
   */
  async unLike(req, res) {
    const UN_LIKED = 1;
    const NEUTRAL = 0;

    const { hotelId } = req.params;
    const { userId } = res.locals.user;

    const hasUnLiked = await hotelService.hasUnLiked(hotelId, userId);

    let action;

    switch (hasUnLiked) {
      case UN_LIKED:
        action = 'Undo unlike';
        await hotelService.setUnLikeStatus(hotelId, userId, NEUTRAL);
        break;
      case NEUTRAL:
        action = 'Unlike';
        await hotelService.setUnLikeStatus(hotelId, userId, UN_LIKED);
        break;
    }

    const hasLiked = await hotelService.hasLiked(hotelId, userId);

    if (hasLiked) {
      await hotelService.setLikeStatus(hotelId, userId, NEUTRAL);
    }

    const hotel = await hotelService.getHotelById(hotelId, userId);

    return Responses.handleSuccess(200, `${action} successful`, res, hotel);
  }
}

export default new Hotel();
