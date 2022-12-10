"use strict";
const port = 3020;
const path = require("path");
const filePath = path.join(__dirname, "/config.json");
const express = require("express");
const { MongoClient } = require("mongodb");
const {
  promises: { readFile },
} = require("fs");
const bodyParser = require("body-parser");
let env, uri, client;

const app = express();

(async function () {
  await readFile(filePath)
    .then((file) => {
      env = JSON.parse(file);
      uri = `mongodb://${env.host}:${env.port}`;
      client = new MongoClient(uri);
      return client.connect();
    })
    .then((_) => {
      console.log("db connected");
    })
    .catch((err) => {
      console.error("[db not connected]", err);
    });
  // const connection = client.db(env.db);
  app.use(bodyParser.json());

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });
  app.listen(port);
})();
