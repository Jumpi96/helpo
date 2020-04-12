#!/bin/bash

docker-compose -f docker-compose.prod.yml build
docker tag helpo_web:latest helpo/helpo_web
docker tag helpo_api:latest helpo/helpo_api
docker push helpo/helpo_web:latest
docker push helpo/helpo_api:latest
