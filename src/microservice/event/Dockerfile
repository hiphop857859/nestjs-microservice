FROM node:14.16.0
RUN npm install -g npm@6.14.7
RUN mkdir -p /var/www/event
WORKDIR /var/www/event
ADD . /var/www/event
RUN npm install
RUN npm run test:e2e
RUN npm run build
USER node
