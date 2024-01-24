FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Copy the 'pages' directory
COPY pages/ ./pages/

RUN npm install

# Copy the rest of your application
COPY . .

RUN npm run build

EXPOSE 8069

CMD [ "npm", "start" ]