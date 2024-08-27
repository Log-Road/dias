# FROM node:18-alpine

# # 작업 디렉토리 설정
# WORKDIR /app

# # 모노레포 전체 의존성 설치
# RUN pnpm i --frozen-lockfile

# # 전체 소스 코드 복사
# COPY . .

# # 빌드 실행
# RUN pnpm build

# EXPOSE 8080 8001 8002

# # 컨테이너 내에서 실행할 스크립트 설정
# CMD ["/start.sh"]

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . .
WORKDIR /apps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --no-frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=asset-server --prod /dist/asset-server
RUN pnpm deploy --filter=admin-server --prod /dist/admin-server

FROM base AS dias
COPY --from=build /dist/dias /dist/dias
WORKDIR /dist/dias
EXPOSE 8080
CMD [ "node", "dist/dias/main.js" ]

FROM base AS asset-server
COPY --from=build /dist/asset-server /dist/asset-server
WORKDIR /dist/asset-server
EXPOSE 8001
CMD [ "node", "dist/asset-server/main.js" ]

FROM base AS admin-server
COPY --from=build /dist/admin-server /dist/admin-server
WORKDIR /dist/admin-server
EXPOSE 8002
CMD [ "node", "dist/admin-server/main.js" ]