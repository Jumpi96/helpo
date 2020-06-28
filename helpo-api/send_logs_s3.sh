#!/bin/bash

ENV=$(grep DJANGO_SETTINGS_MODULE helpo/helpo-api/.env | cut -d '=' -f2)

if [[ $ENV == *"production"* ]]; then
    AWS_KEY=$(grep AWS_ACCESS_KEY_ID helpo/helpo-api/.env | cut -d '=' -f2)
    AWS_SECRET=$(grep AWS_SECRET_ACCESS_KEY helpo/helpo-api/.env | cut -d '=' -f2)
    export AWS_ACCESS_KEY_ID=$AWS_KEY
    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET
    aws s3 cp /code/logs/*.log-* s3://helpo-backups/logs/
    rm /code/logs/*.log-*
fi
