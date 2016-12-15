const winston = require('winston');

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: () => {
                return new Date().toISOString();
            },
            formatter: options => {
                return `[${options.timestamp()}] ${options.level.toUpperCase()} ${options.message}`;
            }
        })
    ]
});