/**
 * Class representing errorHandlers.
 * @extends Error
 */
export default class ErrorHandler extends Error {
  /**
     * Create error handler.
     * @param {string} message - The message to be passed for the error.
     * @param {number} statusCode - The status code of the error.
     */
  constructor(message, statusCode = 500) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
