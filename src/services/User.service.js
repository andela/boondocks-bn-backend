import db from '../models';

/**
 * Class User services creates a middleware
 */
class UserServices {
  /**
   * findUserByEmail - used to get user from database by email
   * @param {string} email - email of the user
   * @returns {object} user data from database
   */
  async findUserByEmail(email) {
    const user = await db.user.findOne({ where: { email } });
    if (!user) return null;
    const lastLogin = new Date().toISOString();
    await db.user.update({ lastLogin }, { where: { email } });
    return user;
  }

  /**
   * @name GetUserById
   * @description Interacts with model to find a single user
   * @param { string } id the user's id
   * @returns {object} return the user's data
   */
  async getUserById(id) {
    const userData = await db.user.findByPk(
      id,
      {
        attributes: [
          'firstName',
          'lastName',
          'email',
          'isVerified',
          'birthDate',
          'residenceAddress',
          'preferredLanguage',
          'preferredCurrency',
          'department',
          'lineManagerId',
          'gender',
          'lastLogin',
          'role',
          'phoneNumber',
        ],
        include: ['LineManager'],
      },
    );
    return userData;
  }

  /**
   * @name updateUserInfoByEmail
   * @description Interacts with model to find a single user
   * @param { object } attributes the user attribute to update
   * @param { string } email$ the user's email
   * @returns {object} return the user's data
   */
  async updateUserInfoByEmail(attributes, email$) {
    const {
      firstName, lastName, email, birthDate, preferredLanguage, preferredCurrency, residenceAddress,
      gender, department, lineManagerId, phoneNumber
    } = attributes;

    const currentUserId = (await db.user.findOne({
      where: { email: email$ },
      attributes: ['id']
    })).dataValues.id;

    let result;

    const isLineManagerData = await db.user.findOne({ where: { id: lineManagerId } });

    const isLineManagerValid = isLineManagerData && (await db.user.findOne({ where: { id: lineManagerId } })).dataValues.role === 'manager';

    if (!isLineManagerData) {
      result = 'manager_doesnt_exist';
    } else if (lineManagerId === currentUserId) {
      result = 'own_manage';
    } else if (!isLineManagerValid) {
      result = 'invalid_manager';
    } else {
      const userDetails = await db.user.update(
        {
          firstName,
          lastName,
          birthDate,
          preferredLanguage,
          preferredCurrency,
          gender,
          email,
          residenceAddress,
          lineManagerId,
          department,
          phoneNumber,
        },
        {
          where: { email: email$ },
          returning: true,
          plain: true
        }
      );

      result = userDetails[1].dataValues;

      delete result.password;
    }

    return result;
  }

  /**
   * setUserRole - used to update a user's role by the email provided
   * @param {object} body - request object posted to route
   * @returns {object} updated user object
   */
  async setUserRole(body) {
    const updateUser = await db.user.update(
      {
        role: body.role
      },
      {
        returning: true,
        where: { email: body.email }
      }
    );
    // eslint-disable-next-line no-unused-vars
    const [rowsUpdate, [updatedUser]] = updateUser;
    return updatedUser;
  }
}

export default new UserServices();
