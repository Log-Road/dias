FROM node:18-alpine

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
RUN pnpm build

CMD [ "pm2", "start", "dist/app.js", "-i", "3" ]