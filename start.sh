#!/bin/sh

# A 서버 시작
node dist/dias/main.js &

# B 서버 시작
node dist/asset-server/main.js &

# C 서버 시작
node dist/admin-server/main.js&

# 프로세스가 종료되지 않도록 유지
wait -n
