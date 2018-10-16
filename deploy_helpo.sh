#!/bin/bash

docker-compose -f docker-compose.prod.yml build
docker tag helpo_web:latest helpo/helpo_web
docker push helpo/helpo_web:latest