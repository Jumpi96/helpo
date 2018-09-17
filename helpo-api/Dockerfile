FROM python:3.6-jessie
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD Pipfile /code/
ADD Pipfile.lock /code/
RUN pip install pipenv
RUN pipenv install --system
RUN pipenv install --dev --system
ADD . /code/
# cron installation for periodic command scheduler
RUN apt-get update && apt-get install -y --no-install-recommends cron \
    && rm -rf /var/lib/apt/lists/* && crontab cronjob
EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]