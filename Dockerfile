FROM node:20-alpine

ENV NODE_VERSION 20.12.2

RUN mkdir -p /app
WORKDIR /app

RUN apt-get update 
RUN npm i pm2 -g
RUN npm i -g pnpm

COPY . .
RUN export NODE_ENV=prod
RUN pnpm install
RUN cd /app/src
RUN pnpm prisma generate
RUN cd ..
RUN pnpm build

CMD [ "pnpm", "prod" ]