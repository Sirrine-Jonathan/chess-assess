# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn global add typescript tsc
RUN yarn install --production
RUN cd ./client && yarn install --production && yarn build && cd ..
RUN yarn build
CMD ["node", "./dist/server.js"]
EXPOSE 3000