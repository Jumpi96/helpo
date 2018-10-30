FROM python:3.6-jessie
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential
RUN pip install numpy && pip install -r requirements.txt
# cron installation for periodic command scheduler
ADD cronjob /code/
RUN apt-get install -y --no-install-recommends cron \
    && rm -rf /var/lib/apt/lists/* && crontab cronjob
ADD . /code/
EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]