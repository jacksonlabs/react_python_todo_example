#!/bin/bash

./stop.sh

rm -rf pgdata

docker rmi -f reactpythontodoexample_todo-api:latest
