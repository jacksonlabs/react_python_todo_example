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

./stop.sh $environment

rm -rf pgdata_$environment

docker rmi -f todo-api:$environment
docker rmi -f todo-gui:$environment
