#!/bin/bash
#
# Script intended to be run from a local dev-env
# WARNING: Check the content of helpo-web/.env before running

docker-compose -f docker-compose.prod.yml build
docker tag helpo_web:latest helpo/helpo_web:latest
docker push helpo/helpo_web:latest
