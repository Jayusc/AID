FROM node:19-slim

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

# RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# COPY ./app .

EXPOSE 3000

CMD ["node","server.js"]