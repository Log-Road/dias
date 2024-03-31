FROM node:18.14.0

RUN mkdir -p /var/app
WORKDIR /var/app

RUN apt-get update 
RUN npm i -g pnpm

COPY . .
RUN pnpm install

EXPOSE 8080
CMD [ "pnpm", "start:prod" ]