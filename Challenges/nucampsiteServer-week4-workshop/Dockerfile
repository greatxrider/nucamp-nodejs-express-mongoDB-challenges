# Use Node.js version 14 with Alpine Linux
FROM node:latest

ENV NODE_ENV=production

ENV PORT=8080

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 8080

ENTRYPOINT ["npm", "start"]
