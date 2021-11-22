const winston = require('winston');

const format = winston.format.combine(winston.format.json(), winston.format.timestamp());
const logger = winston.createLogger({
  level: 'info',
  format,
  defaultMeta: {service: 'rides-service'},
  transports: [
    new winston.transports.File({filename: 'logs/error.log', level: 'error', format}),
    new winston.transports.File({filename: 'logs/info.log', level: 'info', format}),
    new winston.transports.File({filename: 'logs/combined.log', format}),
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
      ),
    }),
  ],
});

module.exports = logger;
