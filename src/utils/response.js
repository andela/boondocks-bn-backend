/**
 * Formatted response class
 */
export default class Responses {
  /**
   * handleSuccess Function
   * @param {int} statusCode - Status code
   * @param {string} message - Message
   * @param {object} res - Response
   * @param {object | null} data - Data
   * @return {object} - Returned Formatted response object
   */
  static handleSuccess(statusCode, message, res, data = null) {
    return res.status(statusCode)
      .json(data ? {
        status: 'success',
        message,
        data
      } : {
        status: 'success',
        message
      });
  }

  /**
   * handleError Function
   * @param {int} statusCode - Status code
   * @param {string} message - Message
   * @param {object} res - Response
   * @returns {object} - Returned Formatted response object
   */
  static handleError(statusCode, message, res) {
    return res.status(statusCode)
      .json({
        status: 'error',
        message
      });
  }
}
