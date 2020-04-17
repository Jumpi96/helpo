FROM python:3.6-jessie

ENV PYTHONUNBUFFERED 1

RUN apt-get update -y && \
    apt-get install -y python-pip python-dev build-essential postgresql-client && \
    apt-get install -y --no-install-recommends cron && \
    rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    mkdir /code

WORKDIR /code

ADD cronjobs /code/
RUN crontab cronjobs/tasks && crontab cronjobs/backup

ADD requirements.txt /code/
RUN pip install numpy awscli && pip install -r requirements.txt

ADD . /code/

EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]
