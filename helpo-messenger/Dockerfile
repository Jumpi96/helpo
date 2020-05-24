FROM ejabberd/ecs

USER root
ENV PGPASSWORD postgres

RUN apk add --no-cache postgresql-client

RUN psql -h db -p 5432 --username postgres