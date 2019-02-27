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

if [ "$environment" == "dev" ]; then
  docker-compose -f docker-compose.dev.yml down
fi
if [ "$environment" == "localtest" ]; then
  docker-compose -f docker-compose.localtest.yml down
fi
if [ "$environment" == "test" ]; then
  docker-compose -f docker-compose.test.yml down
fi
if [ "$environment" == "prod" ]; then
  docker-compose -f docker-compose.prod.yml down
fi