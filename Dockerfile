FROM node:20-alpine AS base

FROM base AS set

ENV NODE_VERSION 20.12.2

RUN mkdir -p /app
WORKDIR /app

RUN apk update 
RUN apk add npm
RUN apk add tree
RUN npm i -g pm2
RUN npm i -g pnpm

FROM setEnv AS build

COPY . .
RUN export NODE_ENV=prod
RUN pnpm install
RUN pnpm prisma generate
RUN cd ..

EXPOSE 8080

CMD [ "pnpm", "prod" ]