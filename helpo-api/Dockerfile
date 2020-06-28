FROM python:3.6-jessie

ENV PYTHONUNBUFFERED 1

RUN apt-get update -y && \
    apt-get install -y python-pip python-dev build-essential && \
    apt-get install -y --no-install-recommends cron logrotate && \
    rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    mkdir /code

WORKDIR /code

ADD cronjobs /code/cronjobs
RUN crontab cronjobs/tasks

ADD requirements.txt /code/
RUN pip install -r requirements.txt

ADD . /code/

RUN cat /code/logrotate.conf >> /etc/logrotate.conf

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]
