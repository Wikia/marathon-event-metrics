const http = require('http');

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
    if (flatFields) {
        data += ' ' + flatFields;
    }
    return data + ' ' + new Date(time).getTime();
}

function path(params) {
    return '/write?' + flatten({ db: params.db, precision: 'ms' }, '&');
}

module.exports = function influx(params) {
    return {
        writePoint: function(measurement, point, time) {
            const dataPoint = serialize(measurement, point.tags, point.fields, time);
            console.log(`Writing data point: ${dataPoint}`);
            const requestOptions = {
                host: params.host,
                port: params.port,
                path: path(params),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(dataPoint)
                }
            };
            const req = http.request(requestOptions, res => {
                if (res.statusCode !== 204) {
                    console.error('Request to Influx failed');
                }
            });
            req.setTimeout(1000, () => {
                console.error('Request to Influx timed out');
            })
            req.write(dataPoint);
            req.end();
        }
    };
};
