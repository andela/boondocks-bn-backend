import JWThelper from '../utils/jwt';
import db from '../models';
import Responses from '../utils/response';

/**
 * function - decodes the token from the email verification
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {undefined}
 */
const decodeQueryToken = async (req, res, next) => {
  const { token } = req.query;
  const decoded = await JWThelper.decodeToken(token);
  if (Object.keys(decoded)[0] === 'error') {
    return Responses.handleError(401, 'invalid token, Please try to regenerate another email', res);
  }
  const user = await db.user.findOne({
    where: { email: decoded.email }
  });
  res.locals.user = user;
  next();
};

/**
* function - decodes the token from the request
* @param {} req
* @param {} res
* @param {} next
* @returns {undefined}
*/

const verifyUser = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (token === undefined) {
    return Responses.handleError(401, 'Token not provided', res);
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  const decoded = await JWThelper.decodeToken(token);
  if (Object.keys(decoded)[0] === 'error') {
    return Responses.handleError(401, 'Invalid token, please login', res);
  }
  const user = await db.user.findOne({
    where: { email: decoded.email }
  });

  res.locals.user = {
    email: user.email,
    name: user.firstName,
    userId: user.id,
    verified: user.isVerified,
    role: user.role,
    receiveNotification: user.receiveNotification,
    lineManager: user.lineManagerId
  };
  next();
};

export { decodeQueryToken, verifyUser };
