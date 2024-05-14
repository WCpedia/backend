FROM node:18.18.2-alpine

# Docker container 안의 기본 workdir를 /usr/src/app으로 설정.
WORKDIR /usr/src/app

COPY dist ./dist

COPY .env .

COPY node_modules ./node_modules

COPY package.json ./

COPY prisma ./prisma

# 이미지가 실행되어 docker container가 되는 시점에 실행될 명령어.
CMD ["npm", "run", "start:prod"]