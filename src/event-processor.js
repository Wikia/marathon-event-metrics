const log = require('./log');

module.exports = function crateEventProcessor(influx) {

    /**
     * A map of <event type> -> <event adapter>, where <event adapter> is a function that takes
     * an event object of the specified type and returns an object containing tags and fields
     * that should be sent to influx
     */
    const dataAdapters = {
        'status_update_event': event => {
            const appId = event.appId;
            const cutPoint = appId.lastIndexOf('/');
            return {
                tags: {
                    app: appId.substring(cutPoint + 1),
                    group: appId.substring(0, cutPoint) || '/',
                    task_status: event.taskStatus
                },
                fields: {
                    task_failed: event.taskStatus === 'TASK_FAILED'
                }
            };
        }
    };

    return {
        process: event => {
            log.info(`Received event: ${event.eventType}`);
            const adapter = dataAdapters[event.eventType];
            if (adapter) {
                const dataPoint = adapter(event);
                influx.writePoint(event.eventType, dataPoint, event.timestamp);   
            }
        }
    };
}