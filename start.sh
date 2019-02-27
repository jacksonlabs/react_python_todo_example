#!/bin/bash

usage() {
  echo -e "Usage: $0 [ dev | test | prod ]\n(no arg for dev)"
  exit 1
}

environment="dev"

if [ $# -eq 1 ]; then
  if [ "$1" == "dev" ] || [ "$1" == "test" ] || [ "$1" == "prod" ]; then
    environment="$1"
  else
    usage
  fi
elif [ $# -gt 1 ]; then
  usage
fi

echo $environment

export UID=${UID}
export GID=$(id -g $(whoami))

docker network create nginx-proxy

if [ "$environment" == "dev" ]; then
  mkdir -p pgdata_dev
  docker build -t todo-api:dev -f ./api/Dockerfile ./api
  docker build -t todo-gui:dev -f ./gui/Dockerfile-dev ./gui
  docker-compose -f docker-compose.dev.yml up -d 
fi
if [ "$environment" == "test" ]; then
  mkdir -p pgdata_test
  docker build -t todo-api:test -f ./api/Dockerfile ./api
  docker build -t todo-gui:test -f ./gui/Dockerfile ./gui
  docker-compose -f docker-compose.test.yml up -d
fi
if [ "$environment" == "prod" ]; then
  mkdir -p pgdata_prod
  docker build -t todo-api:prod -f ./api/Dockerfile ./api
  docker build -t todo-gui:prod -f ./gui/Dockerfile ./gui
  docker-compose -f docker-compose.prod.yml up -d
fi