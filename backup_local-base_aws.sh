#!/bin/bash
#
# Script to create a daily backup of the local PostgreSQL DB running in AWS
# Cron it using `crontab -e` && "0 0 * * * /home/ec2-user/helpo/backup_local-base_aws.sh"

ENV_FILE="/home/ec2-user/helpo/helpo-api/.env"
ENV=$(grep DJANGO_SETTINGS_MODULE "${ENV_FILE}" | cut -d '=' -f2)
S3_BUCKET="helpo-backups"

if [[ $ENV == *"production"* || $ENV == *"staging"* ]]; then

    if [[ $ENV == *"staging"* ]]; then
        S3_BUCKET="helpo-backups-staging"
    fi

    AWS_KEY=$(grep AWS_ACCESS_KEY_ID "${ENV_FILE}" | cut -d '=' -f2)
    AWS_SECRET=$(grep AWS_SECRET_ACCESS_KEY "${ENV_FILE}" | cut -d '=' -f2)
    BACKUP_NAME=$(date -d "today" +"%Y%m%d%H%M").tar

    export AWS_ACCESS_KEY_ID=$AWS_KEY
    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET
    export PGPASSWORD="postgres"
    
    /usr/bin/pg_dump --host=localhost --port=5432 --username=postgres --dbname=db-helpo --file="${BACKUP_NAME}" --format=t 2>&1 | sudo tee -a logs/backup_"${BACKUP_NAME}".log
    aws s3 cp "${BACKUP_NAME}" s3://"${S3_BUCKET}"/"${BACKUP_NAME}" 2>&1 | sudo tee -a logs/backup_"${BACKUP_NAME}".log
    rm "${BACKUP_NAME}"

fi
