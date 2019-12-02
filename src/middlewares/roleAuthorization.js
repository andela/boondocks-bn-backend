import Responses from '../utils/response';

const roleAuthorization = {
  checkIsSuperAdministrator(req, res, next) {
    const { role } = res.locals.user;
    if (role === 'super_administrator') {
      next();
    } else {
      Responses.handleError(403, 'insufficient privileges', res);
    }
  }
};
export default roleAuthorization;
