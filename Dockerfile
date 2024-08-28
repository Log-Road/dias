# Base Stage
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Build Stage
FROM base AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --no-frozen-lockfile
RUN pnpm build

# Final Stage
FROM base AS final
WORKDIR /app

COPY --from=build /app/dist/apps/dias /dias
COPY --from=build /app/dist/apps/asset-server /asset-server
COPY --from=build /app/dist/apps/admin-server /admin-server

# Expose ports for each service
EXPOSE 8080 8001 8002

# Use supervisord to manage multiple processes
RUN apt-get update && apt-get install -y supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord"]
