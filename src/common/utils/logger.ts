import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

let logger: winston.Logger;
/**
 * @description transport for logger => files kept for 7 days attribute:  maxFiles: '7d'
 */
const transport = new DailyRotateFile({
  filename: './logs/app/log%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '50m',
  maxFiles: process.env.EXPIRE_TIME,
});

export const initializeES = () => {
  logger = winston.createLogger({
    transports: [transport],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  });
};

/**
 * Helps in creating a structured info log
 * @param {String} message
 * @param {String} source
 * @param {Object} details
 */
export const createInfoLog = (
  message: string,
  source = 'unknown',
  details: Record<string, unknown> = {},
) => {
  try {
    logger.info({ message, source, details });
  } catch (error) {
    console.log({ message, source, details });
  }
};

/**
 * Helps in creating a structured error log
 * @param {String} message
 * @param {String} source
 * @param {Object} details
 */
export const createErrorLog = (
  message: string,
  source = 'unknown',
  details: Record<string, unknown> = {},
) => {
  try {
    logger.error({ message, source, details });
  } catch (error) {
    console.log({ message, source, details });
  }
};
