const express = require('express');
const bodyParser = require('body-parser');
const eventProcessor = require('./event-processor');
const influx = require('./influx-client');
const marathon = require('./marathon-client');
const config = require('./config');

marathon(config.marathon).resubscribe(`http://${config.callback.host}:${config.callback.port}/events`);

const influxClient = influx({
    host: config.influx.host,
    port: config.influx.port,
    db: config.influx.db
});

const processor = eventProcessor(influxClient);

const app = express();

app.use(bodyParser.json());

app.post('/events', (req, res) => {
    processor.process(req.body);
    res.end();
});

app.get('/__healthcheck', (req, res) => {
    res.send('ok');
})

app.listen(config.port);