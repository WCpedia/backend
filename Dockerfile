FROM node:18.18.2-alpine

# Docker container 안의 기본 workdir를 /usr/src/app으로 설정.
WORKDIR /usr/src/app

COPY dist ./dist

COPY .env .

COPY node_modules ./node_modules

COPY package.json ./

COPY prisma ./prisma

# docker container의 3000번 포트
# EC2 내부에서는 해당 이미지를 사용하는 docker container의 3000번 포트에 접근가>능
EXPOSE 3000

# 이미지가 실행되어 docker container가 되는 시점에 실행될 명령어.
CMD ["npm", "run", "start:prod"]