

const winston = require('winston');

const logger = winston.createLogger({
    level: 'verbose',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(log => `${log.timestamp} | ${log.level}: ${log.message}`),
    ),
    transports: [
        new winston.transports.Console({ colorize: true }),
        new winston.transports.File({
            colorize: false,
            json: false,
            filename: './server/logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({
            colorize: false,
            json: false,
            filename: './server/logs/info.log',
            level: 'info',
        }),
    ],
});

logger.stream = {
    write: (info) => {
        logger.info(info);
    },
};

module.exports = logger;
