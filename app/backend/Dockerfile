FROM node:19-slim

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

WORKDIR /usr/src/app
CMD ["sh","-c","npm install; npm run dev"]