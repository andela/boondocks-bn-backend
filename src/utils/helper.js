/**
   * use to wrap around controller to avoid try catch blocks
   * @param {function} fn
   * @returns {function} next
   */
const catchErrors = fn => (req, res, next) => fn(req, res, next).catch(next);

export default catchErrors;
