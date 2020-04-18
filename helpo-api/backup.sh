#!/bin/bash

ENV=$(grep DJANGO_SETTINGS_MODULE .env | cut -d '=' -f2)

if [[ $env == *"production"* ]]; then
    BACKUP_NAME=$(date -d "today" +"%Y%m%d%H%M").sql
    /usr/bin/pg_dump db:5432 -U postgres db-helpo > $BACKUP_NAME
    aws s3 cp $BACKUP_NAME s3://helpo-backups/$BACKUP_NAME
    rm $BACKUP_NAME
fi