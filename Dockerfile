
FROM node:20-alpine AS base

FROM base AS set

ENV NODE_VERSION 20.12.2

RUN mkdir -p /app
WORKDIR /app

RUN apk update 
RUN apk add npm

FROM set AS build

COPY . .
RUN export NODE_ENV=prod
RUN cd ..

EXPOSE 8080

CMD [ "pnpm", "node:prod" ]