FROM node:20-alpine AS base

FROM base AS set

ENV NODE_VERSION=20.12.2
ENV NODE_ENV prod

RUN mkdir -p /app
WORKDIR /app

RUN apk update
RUN npm i pnpm -g
COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm i --no-frozen-lockfile

FROM set AS build

COPY . .
RUN cd ..

EXPOSE 8080

CMD [ "pnpm", "start" ]