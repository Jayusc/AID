FROM node:19-slim

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

RUN mkdir -p /home/app

COPY ./app /home/app

EXPOSE 3000

CMD ["node","/home/app/server.js"]