# marathon-event-metrics
`marathon-event-metrics` is a tool for reporting [Marathon events](https://mesosphere.github.io/marathon/docs/event-bus.html) to [InfluxDB](https://www.influxdata.com/time-series-platform/influxdb/).

## Configuration
The tool is configured via the following environment variables:
- `INFLUX_HOST` (no default value) - InfluxDB host
- `INFLUX_PORT` (`8086`) - InfluxDB [http API](https://docs.influxdata.com/influxdb/v1.1/tools/api/) port
- `INFLUX_DB` (`marathon`) - name of the database that will hold the measurements. It must already exist. The tool will use the default retention policy.
- `INFLUX_STATIC_TAGS` (no default value) - a set of static tags to be sent with every data point, formatted according to Influx's [line protocol](https://docs.influxdata.com/influxdb/v1.1/write_protocols/line_protocol_tutorial/#tag-set), e. g. `environment=dev,foo=bar`
- `MARATHON_HOST` (`localhost`) - Marathon host
- `MARATHON_PORT` (`8080`) - Marathon [http API](https://mesosphere.github.io/marathon/docs/rest-api.html) port
- `CALLBACK_HOST` (`localhost`) - the host that Marathon should send the events to, aka the host this application is running on
- `PORT0` (defaults to the value of `APP_PORT`) - this application's http API port that is available "publicly" (e. g. when running inside a Docker container)
- `APP_PORT` (`9999`) - the "local" http API port

## Running the application
Locally (requires NodeJS)
```
npm start
```

Using Docker
```
docker build .
docker run -e 'INFLUX_HOST=...' -e ... <image-id>
```

## Supported events
Currently the tool reports the following event types:
- `status_update_event`