import { format, transports, LoggerOptions } from 'winston';

export const logger:LoggerOptions = {
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.colorize(),
    format.json(),
    format.printf((info) => `{"hora": "${info.timestamp}", "nivel": "${info.level}", "message": "${info.message}", "servicio":"${info.service}"},`)
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ 
      maxsize: 5120000,
      maxFiles: 5,
      level: 'error',
      filename: `${__dirname}/../logs/error-log-api.json`
    }),
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      level: 'info',
      filename: `${__dirname}/../logs/info-log-api.json`
    })
  ]
};

