const winston = require('winston');

// left pad
function lp(n, len) {
    const diff = (len || 2) - n.toString().length;
    if (diff > 0) {
        return (new Array(diff + 1).join('0')) + n;
    }
    return n;
}

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: () => {
                const now = new Date();
                return `${now.getUTCFullYear()}-${lp(now.getUTCMonth() + 1)}-${lp(now.getUTCDate())}T${lp(now.getUTCHours())}:${lp(now.getUTCMinutes())}:${lp(now.getUTCSeconds())}.${lp(now.getUTCMilliseconds(), 3)}Z`;
            },
            formatter: options => {
                return `[${options.timestamp()}] ${options.level.toUpperCase()} ${options.message}`;
            }
        })
    ]
});