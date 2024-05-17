FROM node:22-alpine

WORKDIR /var/www/

COPY package*.json .

RUN npm ci

COPY . .

CMD [ "npm", "run", "dev" ]
