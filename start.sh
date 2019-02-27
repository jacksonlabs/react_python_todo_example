#!/bin/bash

usage() {
  echo -e "Usage: $0 [ dev | localtest | test | prod ]\n(no arg for dev)"
  exit 1
}

environment="dev"

if [ $# -eq 1 ]; then
  if [ "$1" == "dev" ] || [ "$1" == "localtest" ] || [ "$1" == "test" ] || [ "$1" == "prod" ]; then
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

mkdir -p pgdata_$environment

if [ "$environment" == "dev" ]; then
  docker build -t jacksonlabs/todo-api:dev -f ./api/Dockerfile ./api
  docker build -t jacksonlabs/todo-gui:dev -f ./gui/Dockerfile-dev ./gui
  docker-compose -f docker-compose.dev.yml up -d 
fi
if [ "$environment" == "localtest" ]; then
  docker build -t jacksonlabs/todo-api:localtest -f ./api/Dockerfile ./api
  cd gui
  docker build -t jacksonlabs/todo-gui:localtest -f ./Dockerfile .
  cd ..
  docker-compose -f docker-compose.localtest.yml up -d
fi
if [ "$environment" == "test" ]; then
  docker network create nginx-proxy
  docker build -t jacksonlabs/todo-api:test -f ./api/Dockerfile ./api
  cd gui
  docker build -t jacksonlabs/todo-gui:test -f ./Dockerfile .
  cd ..
  docker-compose -f docker-compose.test.yml up -d
fi
if [ "$environment" == "prod" ]; then
  docker network create nginx-proxy
  docker build -t jacksonlabs/todo-api:prod -f ./api/Dockerfile ./api
  cd gui
  docker build -t jacksonlabs/todo-gui:prod -f ./Dockerfile .
  cd ..
  docker-compose -f docker-compose.prod.yml up -d
fi