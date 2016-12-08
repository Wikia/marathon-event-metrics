const express = require('express');
const bodyParser = require('body-parser');
const eventProcessor = require('./event-processor');
const influx = require('./influx-client');
const marathon = require('./marathon-client');
const config = require('./config');
const log = require('./log');

marathon(config.marathon).resubscribe(`http://${config.callback.host}:${config.callback.port}/events`);

const influxClient = influx(config.influx);

const processor = eventProcessor(influxClient);

const app = express();

app.use(bodyParser.json());

app.post('/events', (req, res) => {
    processor.process(req.body);
    res.end();
});

app.get('/__healthcheck', (req, res) => {
    res.send('ok');
});

log.info(`Starting server on port ${config.port}`);

app.listen(config.port);