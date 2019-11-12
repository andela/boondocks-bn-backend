/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import router from './routes/index';
import logger from './utils/winston';
import Responses from './utils/response';
import ErrorHandler from './utils/error';

const isDevelopment = process.env.NODE_ENV;

const app = express();

app.use(cors());

app.use(urlencoded({ extended: false }));
app.use(json());

// used in testing heroku
app.get('/', (req, res) => Responses.handleSuccess(200, 'Welcome to Barefoot Nomad', res));

// to throw an error to the logger
app.get('/err', (req, res) => {
  throw new ErrorHandler('Error here');
});

app.use(router);
app.use((req, res, next) => Responses.handleError(404, 'Not found', res));

// development error handler middleware
app.use((err, req, res, next) => {
  if (isDevelopment !== 'development') {
    return next(err);
  }
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${
    req.ip
  } - Stack: ${err.stack}`);

  return Responses.handleError(err.statusCode, `${err.message} - check logs for more info`, res);
});

// Production and testing error handler middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${
    req.ip
  } - Stack: ${err.stack}`);

  return Responses.handleError(err.statusCode, err.message, res);
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});
