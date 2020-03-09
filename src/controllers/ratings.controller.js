import Responses from '../utils/response';
import {
  createRating,
  updateRating,
  getHotelRating,
  getAllHotelRatingsByUser,
  getAllHotelRatings
} from '../services/rating.service';

/**
 * Class Ratings
 */
class Ratings {
  /**
   * @param {*} req
   * @param {*} res
   * @returns {object} successfully rate a hotel
   */
  async rateHotel(req, res) {
    const { user } = res.locals;
    const params = {
      userId: user.userId,
      rating: req.body.rating,
      hotelId: req.params.hotelId
    };
    const rating = await createRating(params);
    return Responses.handleSuccess(201, 'Hotel rated successfully', res, rating);
  }

  /**
   * @param {*} req
   * @param {*} res
   * @returns {object} successfully update a hotel rating
   */
  async changeHotelRating(req, res) {
    const { userId } = res.locals.user;
    const params = {
      userId,
      rating: req.body.rating,
      ratingId: req.params.ratingId
    };
    const rating = await updateRating(params);
    return Responses.handleSuccess(201, 'Hotel rating updated successfully', res, rating);
  }

  /**
   * @param {*} req
   * @param {*} res
   * @returns {object} successfully update a hotel rating
   */
  async fetchHotelRating(req, res) {
    const { userId } = res.locals.user;
    const params = {
      userId,
      ratingId: req.params.ratingId
    };
    const rating = await getHotelRating(params);
    return Responses.handleSuccess(200, 'Hotel rating fetched successfully', res, rating);
  }

  /**
   * @param {*} req
   * @param {*} res
   * @returns {object} successfully update a hotel rating
   */
  async fetchAllHotelRatings(req, res) {
    let ratings;
    const userId = Number(req.query.userId);
    if (userId && userId > 0) {
      ratings = await getAllHotelRatingsByUser(userId);
    } else {
      ratings = await getAllHotelRatings();
    }
    return Responses.handleSuccess(200, 'Hotel ratings fetched successfully', res, ratings);
  }
}

export default new Ratings();
