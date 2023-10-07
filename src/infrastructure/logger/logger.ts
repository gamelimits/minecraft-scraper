import { createLogger, format, transports } from 'winston';
import { environment } from '../config/environment.js';

export const logger = createLogger({
  transports: [
    new transports.File({
      format: format.combine(format.timestamp(), format.json()),
      filename: 'combined.log',
    }),
  ],
});

if (environment.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      level: 'silly',
      format: format.combine(format.colorize(), format.padLevels(), format.simple()),
    }),
  );
}
