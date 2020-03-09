import { createLogger, format, transports } from 'winston';

const {
  combine, timestamp, simple, json
} = format;
const logger = createLogger({
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    new transports.Console({
      format: simple(),
    }),
    new transports.File({ filename: '.logs/error.log', level: 'error' }),
    new transports.File({
      filename: '.logs/info.log',
      level: 'info'
    })
  ],
  exitOnError: false
});

export default logger;
