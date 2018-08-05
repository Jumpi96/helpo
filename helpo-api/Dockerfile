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
 EXPOSE 8000