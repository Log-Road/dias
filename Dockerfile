FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . .
WORKDIR /dist
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --no-frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=asset-server --prod /asset-server
RUN pnpm deploy --filter=admin-server --prod /admin-server

FROM base AS dias
COPY --from=build /dias /dias
WORKDIR /dias
EXPOSE 8080
CMD [ "node", "main.js" ]

FROM base AS asset-server
COPY --from=build /asset-server /asset-server
WORKDIR /asset-server
EXPOSE 8001
CMD [ "node", "main.js" ]

FROM base AS admin-server
COPY --from=build /admin-server /admin-server
WORKDIR /admin-server
EXPOSE 8002
CMD [ "node", "main.js" ]