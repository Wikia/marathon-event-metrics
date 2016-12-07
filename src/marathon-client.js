const http = require('http');
const Promise = require('promise');

module.exports = function(config) {

    function getSubscriptions() {
        return new Promise((resolve, reject) => {
            const options = {
                host: config.host,
                port: config.port,
                path: '/v2/eventSubscriptions',
                method: 'GET'
            };
            http.request(options, res => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    const dataObj = JSON.parse(data);
                    resolve(dataObj.callbackUrls);
                });
            }).end();
        });
    }

    function subRequest(method, callbackUrl) {
        return {
            host: config.host,
            port: config.port,
            path: `/v2/eventSubscriptions?callbackUrl=${callbackUrl}`,
            method: method,
            headers: {
                'Content-Length': 0,
                'Content-Type': 'application/json; charset=utf-8'
            }
        };
    }

    function subscribe(callbackUrl) {
        console.log(`Subscribing to event stream at: ${callbackUrl}`) 
        http.request(subRequest('POST', callbackUrl), res => {
            if (res.statusCode >= 400) {
                console.error(`Subscription failed: ${res.statusCode} ${res.statusMessage}`);
            } else {
                console.log('Subscription succeeded');
            }
        }).end();
    }

    function unsubscribe(callbackUrl) {
        return new Promise((resolve, reject) => {
            console.log(`Unsubscribing from event stream: ${callbackUrl}`)
            http.request(subRequest('DELETE', callbackUrl), res => {
                if (res.statusCode >= 400) {
                    console.error(`Unsubscribe failed: ${res.statusCode} ${res.statusMessage}`);
                } else {
                    console.log('Usubscribe succeeded');
                }
                resolve();
            }).end();
        });
    }

    function unsubscribeFromSimilar(callbackUrl, callback) {
        return getSubscriptions().then(urls => {
            const urlPattern = new RegExp(callbackUrl.replace(/:\d+/, ':\\d+'));
            return Promise.all(urls.filter(url => urlPattern.test(url)).map(unsubscribe))
        });
    } 

    return {
        resubscribe: function(callbackUrl, callback) {
            console.log(`Renewing subscribtion to Marathon events at ${config.host}`);
            unsubscribeFromSimilar(callbackUrl).then(() => subscribe(callbackUrl));
        }
    };
};