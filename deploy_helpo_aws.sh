#!/bin/bash
#
# Script intended to be run from within an AWS EC2 instance
# WARNING: Check the content of helpo-api/.env before running

BRANCH=$1

git status
git checkout ${BRANCH}
git pull
git log -n 1
docker pull helpo/helpo_web:latest
docker-compose -f docker-compose.local-base.aws.yml down
docker-compose -f docker-compose.local-base.aws.yml build api
docker-compose -f docker-compose.local-base.aws.yml up -d --build
docker-compose -f docker-compose.local-base.aws.yml logs -f
