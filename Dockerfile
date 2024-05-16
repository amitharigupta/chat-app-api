FROM node:22-alpine

WORKDIR /var/www/

COPY . .

RUN npm install

CMD [ "npm", "run", "dev" ]

