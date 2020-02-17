import hotelService from '../services/hotel.service';
import locationService from '../services/location.service';
import filesService from '../services/files.service';
import Responses from '../utils/response';
import roomService from '../services/room.service';
import { getAllRequestsHotels } from '../services/request.service';
import addFeeback from '../services/feedback.service';

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
        path,
        mimetype,
      } = req.file;

      image = await filesService.s3Upload({ path, filename, mimetype }, 'hotels');
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
        path,
        mimetype,
      } = req.file;

      image = await filesService.s3Upload({ path, filename, mimetype }, 'rooms');
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
    const hotels = await hotelService.getHotels();
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

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} responses
   */
  async getMostVisitedDestination(req, res) {
    const results = [];
    const bookings = await getAllRequestsHotels();

    if (!bookings.length) {
      return Responses.handleSuccess(
        200,
        'Most travelled destinations listed successfully',
        res, { results: [] },
      );
    }

    const counter = {};

    for (let i = 0; i < bookings.length; i += 1) {
      if (!bookings[i].hotel) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const el = bookings[i].hotel.id;

      if (counter[el] === undefined) {
        counter[el] = 0;
      }
      counter[el] += 1;
    }

    const sortedBookings = [];

    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const element in counter) {
      sortedBookings.push([element, counter[element]]);
    }
    sortedBookings.sort((a, b) => a[1] - b[1]);
    const keys = sortedBookings.map(sortableItem => sortableItem[0]);

    const hotels = await hotelService.mostTravelled(keys);

    for (let i = 0; i < sortedBookings.length; i += 1) {
      const hotel = hotels.find(item => `${item.id}` === sortedBookings[i][0]);
      results.unshift({
        count: sortedBookings[i][1],
        hotel,
      });
    }

    return Responses.handleSuccess(
      200,
      'Most travelled destinations listed successfully',
      res, { results },
    );
  }


  /**
   * Creates a new feedback.
   * @param {object} req request
   * @param {object} res response
   * @returns {object} response object
   */
  async addedFeedback(req, res) {
    const { feedback } = req.body;
    const { userId } = res.locals.user;
    const { hotelId } = req.params;
    const addedFeedback = await addFeeback({ userId, hotelId, feedback });
    return Responses.handleSuccess(201, 'Feedback posted successfully', res, addedFeedback);
  }


  /**
   * Get all feedback
   * @param {object} req request
   * @param {object} res response
   * @returns {object} response object
   */
  async getFeedback(req, res) {
    const { hotelId } = req.params;
    const { userId, role } = res.locals.user;

    const feedback = await hotelService.getFeedback({
      ...role === 'requester' && { userId },
      ...role === 'travel_administrator' && { travelAdminId: userId },
      ...role === 'suppliers' && { travelAdminId: userId },
      hotelId,
    });

    return Responses.handleSuccess(200, 'Feedback retrieved successfully', res, feedback);
  }

  /**
   * Gets all locations
   * @param {object} req request
   * @param {object} res response
   * @returns {object} response object
   */
  async getAllLocations(req, res) {
    let locations;
    const withHotels = req.query.with_hotels;
    if (withHotels && withHotels === 'true') {
      locations = await hotelService.getLocationsWithHotels();
    } else {
      locations = await hotelService.getLocations();
    }
    return Responses.handleSuccess(200, 'Locations fetched successfully', res, locations);
  }
}

export default new Hotel();
