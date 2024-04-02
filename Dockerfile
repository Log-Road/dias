FROM node:18.14.0

RUN mkdir -p /app
WORKDIR /app

RUN apt-get update 
RUN npm i -g pnpm

COPY . .
RUN export NODE_ENV=prod
RUN pnpm install
RUN cd /app/src
RUN pnpm prisma generate
RUN cd ..

CMD [ "pnpm", "start:prod" ]