FROM node:20-alpine

ENV NODE_VERSION 20.12.2

RUN mkdir -p /app
WORKDIR /app

RUN apk update 
RUN apk add npm
RUN apk add tree
RUN npm i -g pm2
RUN npm i -g pnpm

COPY . .
RUN tree 5 -L -d
RUN export NODE_ENV=prod
RUN cd /app/src
RUN pnpm install
RUN pnpm prisma generate
RUN cd ..
RUN pnpm build

CMD [ "pnpm", "prod" ]