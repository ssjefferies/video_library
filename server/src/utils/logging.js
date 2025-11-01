const winston = require('winston');
const { combine, timestamp, json, errors } = winston.format;

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(errors({ stack: true }), timestamp(), json()),
    transports: [new winston.transports.Console(),
        new winston.transports.File({
            filename: process.env.LOG_FILE || 'app.log',
        })
    ]
})

module.exports = logger;