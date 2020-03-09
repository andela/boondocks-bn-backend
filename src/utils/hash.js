import bcrypt from 'bcrypt';
import config from '../config/env/default';

/**
 * Class Hash - for hashing passwords
 */
class Hash {
  /**
   *
   * @param {string} plainPassword
   * @returns {strings} hashed password
   */
  generateSync(plainPassword) {
    return bcrypt.hashSync(plainPassword, config.HASH_SALT_ROUNDS);
  }

  /**
   *
   * @param {string} plainPassword
   * @param {string} hash
   * @returns {boolean} if password matches
   */
  compareSync(plainPassword, hash) {
    return bcrypt.compareSync(plainPassword, hash);
  }
}

export default new Hash();
