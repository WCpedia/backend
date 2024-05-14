#!/bin/sh

cd /home/ubuntu/backend
source /home/ubuntu/backend/.env

npm ci

DOCKER_IMAGE_NAME=server-img

DOCKER_CONTAINER_NAME=server-container

docker system prune -a -f

docker rm -f $(docker ps -qa)

docker build -t ${DOCKER_IMAGE_NAME} . # <--- 프로젝트 루트 경로에 대한 상대경로

docker run -d -p ${PORT}:${PORT} --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE_NAME}
