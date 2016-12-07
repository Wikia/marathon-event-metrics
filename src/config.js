const applicationPort = process.env.APP_PORT || 9999;
module.exports = {
    influx: {
        host: process.env.INFLUX_HOST,
        port: process.env.INFLUX_PORT || 8086,
        db: process.env.INFLUX_DB || 'marathon',
        staticTags: process.env.INFLUX_STATIC_TAGS
    },
    marathon: {
        host: process.env.MARATHON_HOST || 'localhost',
        port: process.env.MARATHON_PORT || 8080
    },
    callback: {
        host: process.env.CALLBACK_HOST || 'localhost',
        port: process.env.PORT0 || applicationPort
    },
    port: applicationPort
};