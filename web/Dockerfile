FROM node:18-alpine

WORKDIR /usr/src/web

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD [ "npm", "start" ]