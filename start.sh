#!/bin/bash

mkdir -p pgadmin
mkdir -p pgdata

export UID=${UID}
export GID=$(id -g $(whoami))
docker-compose up -d
