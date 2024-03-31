FROM node:18
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN pnpm install
RUN pnpm start
EXPOSE 8080
CMD [ "node", "dist/main.js" ]