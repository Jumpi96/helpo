#!/bin/bash

service cron start
./wait-for-it.sh $DB_HOSTNAME:5432 -- bash -c
python manage.py migrate
python manage.py populate_db
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000