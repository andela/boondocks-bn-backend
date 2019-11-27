import Joi from '@hapi/joi';
import { unlinkSync } from 'fs';
import Responses from '../utils/response';
import Schemas from '../utils/schemas';
/**
 * Validates the signup or signin routes using the defined schemas
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {void}
 */
const validation = (req, res, next) => {
  const methodsSupported = ['post', 'put', 'patch'];
  const { path } = req.route;
  const method = req.method.toLowerCase();
  if (methodsSupported.includes(method) && Schemas[path] !== undefined) {
    const schema = Schemas[path];
    const urlParam = Object.keys(req.params)[0];

    const paths = ['/hotels/:hotelId/rooms'];

    if (urlParam !== undefined && paths.includes(path)) {
      req.body[urlParam] = req.params[urlParam];
    }

    return Joi.validate(req.body, schema, (error, data) => {
      if (error) {
        const err = error.details.map(e => (e.message));
        if (req.file !== undefined) {
          unlinkSync(req.file.path);
        }
        return Responses.handleError(400, err, res);
      }
      req.body = data;
      next();
    });
  }
  return Responses.handleError(405, 'Undefined method', res);
};

const validateMultiCity = (req, res, next) => {
  const methodsSupported = ['post'];
  const method = req.method.toLowerCase();

  if (methodsSupported.includes(method)) {
    const trips = req.body;
    const errors = trips.map((item) => {
      const path = item.type === 'return' ? '/trips/return' : '/trips/oneway';
      const schema = Schemas[path];
      let err;
      Joi.validate(item, schema, (error) => {
        if (error) {
          err = error.details.map(e => (e.message));
        }
      });
      return err;
    }).filter((item) => item != null);
    if (errors.length > 0) {
      return Responses.handleError(400, errors, res);
    }

    req.body = trips;
    next();
  }
};

export { validation, validateMultiCity };
