FROM node:alpine

RUN mkdir -p /usr/src/marathon-event-metrics
WORKDIR /usr/src/marathon-event-metrics

COPY package.json /usr/src/marathon-event-metrics/
RUN npm install

COPY . /usr/src/marathon-event-metrics

EXPOSE 9999
ENTRYPOINT ["npm", "start"]