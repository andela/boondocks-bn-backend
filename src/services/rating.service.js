/* eslint-disable function-paren-newline */
import db from '../models';
import ErrorHandler from '../utils/error';

const createRating = async (params) => {
  const { hotelId, userId, rating } = params;
  const userRating = await db.rating.findOrCreate({
    where: { hotelId, userId },
    defaults: {
      hotelId,
      userId,
      rating,
    }
  });

  if (userRating[1] === false) {
    throw new ErrorHandler('you have already rated this hotel', 403);
  }

  const rates = await db.rating.findAll({
    attributes: ['hotelId', [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'ratingAVG']],
    group: 'hotelId',
    order: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'DESC']],
    where: { hotelId }
  });

  await db.hotel.update(
    { average_rating: rates[0].dataValues.ratingAVG },
    { where: { id: hotelId }
    },
  );

  return userRating;
};

const updateRating = async (params) => {
  const { userId, rating, ratingId } = params;

  const isRatingOwner = await db.rating.findAll({
    where: { id: ratingId, userId }
  });

  if (isRatingOwner.length === 0) {
    throw new ErrorHandler('only the user who posted the rating can update it', 401);
  }

  const userRating = await db.rating.update(
    {
      rating
    },
    {
      where: { id: ratingId },
      returning: true
    }
  );

  const { hotelId } = userRating[1][0].dataValues;

  const rates = await db.rating.findAll({
    attributes: ['hotelId', [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'ratingAVG']],
    group: 'hotelId',
    order: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'DESC']],
    where: { hotelId }
  });

  await db.hotel.update(
    { average_rating: rates[0].dataValues.ratingAVG },
    { where: { id: rates[0].dataValues.hotelId }
    },
  );

  return userRating;
};

const getHotelRating = async (params) => {
  const { userId, ratingId } = params;

  const rating = await db.rating.findAll({
    where: { id: ratingId, userId }
  });

  if (rating.length === 0) {
    throw new ErrorHandler('supplied rating id not found', 404);
  }
  return rating;
};

const getAllHotelRatingsByUser = async (userId) => {
  const ratings = await db.rating.findAll({
    where: { userId }
  });
  return ratings;
};

const getAllHotelRatings = async () => {
  const ratings = await db.rating.findAll();
  return ratings;
};

export {
  createRating,
  updateRating,
  getHotelRating,
  getAllHotelRatingsByUser,
  getAllHotelRatings
};
