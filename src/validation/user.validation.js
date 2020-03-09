import db from '../models';
import Responses from '../utils/response';

/**
 * Checks if the email passed in the body already exists
 *@param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {void}
 */
const checkForEmail = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await db.user.findOne({ where: { email } });
  if (userExist) {
    return Responses.handleError(409, 'Email already exist', res);
  }
  next();
};
export default checkForEmail;
