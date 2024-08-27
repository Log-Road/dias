FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

COPY package.prod.json ./
COPY pnpm-lock.yaml ./

# 모노레포 전체 의존성 설치
RUN pnpm i --frozen-lockfile

# 전체 소스 코드 복사
COPY . .

# 빌드 실행
RUN pnpm build

EXPOSE 8080 8001 8002

# 컨테이너 내에서 실행할 스크립트 설정
CMD ["/start.sh"]
