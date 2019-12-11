import Responses from '../utils/response';
import db from '../models';

/**
 * function - checks if user has verfied account via email confirmation/social login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {undefined}
 */
const checkIsEmailVerified = (req, res, next) => {
  const isEmailVerified = res.locals.user.verified;
  if (isEmailVerified === false) {
    return Responses.handleError(
      401,
      'Please verify your account through the confirmation email sent to you on registration',
      res
    );
  }
  next();
};

/**
 * function - checks if user has stayed at hotel he is trying to rate
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {undefined}
 */
const checkHasStayedAtHotel = async (req, res, next) => {
  const { hotelId } = req.params;
  const { userId } = res.locals.user;

  const hasStayedAtHotel = await db.trip.findAll({
    where: { hotelId, userId }
  });

  if (hasStayedAtHotel.length === 0) {
    return Responses.handleError(
      401,
      'You can only rate a hotel you have stayed at on a trip',
      res
    );
  }
  next();
};

export { checkIsEmailVerified, checkHasStayedAtHotel };
