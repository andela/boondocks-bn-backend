import JWT from 'jsonwebtoken';
import config from '../config';

/**
 * Class tokenizer used to encode and decoded tokens
 */
class tokenizer {
  /**
   *
   * @param {object} user - its an object with users data
   * @returns {string} token
   */
  async signToken(user) {
    return JWT.sign({
      email: user.email,
      name: user.firstName,
      userId: user.id,
      verified: user.isVerified,
      role: user.role,
      lineManagerId: user.lineManagerId
    }, config.secret, { expiresIn: '24h' });
  }

  /**
   *
   * @param {string} token
   * @returns {object} users data decoded from token
   */
  async decodeToken(token) {
    const data = JWT.verify(token, config.secret, (err, decoded) => {
      if (err) return { error: err.message };
      return decoded;
    });
    return data;
  }
}

export default new tokenizer();
