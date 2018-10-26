FROM python:3.6-jessie
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential
RUN pip install -r requirements.txt
ADD . /code/
EXPOSE 5000
ENTRYPOINT ["python"]
CMD ["app.py"]