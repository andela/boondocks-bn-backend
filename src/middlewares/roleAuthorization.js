import Responses from '../utils/response';

const authorize = (allowed) => (req, res, next) => {
  const { role } = res.locals.user;
  if (allowed.includes(role)) {
    next();
  } else {
    Responses.handleError(403, 'insufficient privileges', res);
  }
};

export default authorize;
