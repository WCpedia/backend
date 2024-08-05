#!/bin/bash

cd /home/ubuntu/tori-backend
source /etc/profile

aws s3 cp ${S3_URL} /home/ubuntu/tori-backend/.env

npm ci

docker system prune -a -f

docker rm -f $(docker ps -qa)

docker build -t ${DOCKER_IMAGE_NAME} . # <--- 프로젝트 루트 경로에 대한 상대경로

docker run -d -p ${PORT}:${PORT} --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE_NAME}