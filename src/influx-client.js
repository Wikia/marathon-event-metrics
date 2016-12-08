const http = require('http');
const log = require('./log');

module.exports = function influx(config) {

    function flatten(values, separator) {
        values = values || {};
        return Object.keys(values).map(key => key + '=' + values[key]).join(separator || ',');
    }

    function serialize(measurement, tags, fields, time) {
        const flatTags = flatten(tags);
        const flatFields = flatten(fields);
        let data = measurement;
        if (flatTags) {
            data += ',' + flatTags;
        }
        if (config.staticTags) {
            data += ',' + config.staticTags;
        }
        if (flatFields) {
            data += ' ' + flatFields;
        }
        return data + ' ' + new Date(time).getTime();
    }

    function path() {
        return '/write?' + flatten({ db: config.db, precision: 'ms' }, '&');
    }

    return {
        writePoint: function(measurement, point, time) {
            const dataPoint = serialize(measurement, point.tags, point.fields, time);
            log.info(`Writing data point: ${dataPoint}`);
            const options = {
                host: config.host,
                port: config.port,
                path: path(),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(dataPoint)
                }
            };
            const req = http.request(options, res => {
                if (res.statusCode !== 204) {
                    log.error(`Request to Influx failed: ${res.statusCode} ${res.statusMessage}`);
                }
            });
            req.setTimeout(1000, () => {
                log.error('Request to Influx timed out');
            })
            req.write(dataPoint);
            req.end();
        }
    };
};
