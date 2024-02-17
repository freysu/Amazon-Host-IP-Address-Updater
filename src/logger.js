// logger.js
const winston = require('winston');
const { format, transports } = winston;

// 创建日志格式
const logFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
);

// 创建日志记录器
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        logFormat
      )
    }),
    new transports.File({
      filename: 'combined.log',
      level: 'info',
      format: format.combine(
        logFormat
      )
    }),
    new transports.File({
      filename: 'error.log',
      level: 'error',
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(({ level, message }) => `${level}: ${message}`)
      )
    })
  ]
});

// 添加辅助日志函数
logger.debug = (message) => logger.log('debug', message);
logger.warn = (message) => logger.log('warn', message);
logger.error = (message) => logger.log('error', message);

module.exports = logger;