FROM node:14.16.0
RUN npm install -g npm@6.14.7
RUN mkdir -p /var/www/admin
WORKDIR /var/www/admin
ADD . /var/www/admin
RUN npm install
RUN npm run test:e2e
RUN npm run build
USER node
