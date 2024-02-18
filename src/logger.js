// logger.js
const winston = require('winston');
const { format, transports, Logger } = winston;

// 创建日志格式
const logFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  format.printf(({ timestamp, level, message }) => {
    // 如果消息是一个数组，那么将它们连接起来
    if (Array.isArray(message)) {
      return `${timestamp} ${level}: ${message.map(m => m.toString()).join(' ')}`;
    }
    return `${timestamp} ${level}: ${message}`;
  })
);

// 创建日志记录器
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
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
logger.debug = (message, ...args) => logger.log('debug', message, ...args);
logger.warn = (message, ...args) => logger.log('warn', message, ...args);
logger.error = (message, ...args) => logger.log('error', message, ...args);

module.exports = logger;