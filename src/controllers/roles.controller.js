import Responses from '../utils/response';
import UserServices from '../services/User.service';

/**
 * Class for roles related operations
 */
class Role {
  /**
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   * @returns {object} responses
   */
  async changeRole(req, res) {
    const user = await UserServices.findUserByEmail(req.body.email);
    if (!user) {
      return Responses.handleError(404, 'user not found', res);
    }
    const updatedUser = await UserServices.setUserRole(req.body);

    const userObject = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
    };
    return Responses.handleSuccess(200, 'user role updated', res, userObject);
  }
}
export default new Role();
