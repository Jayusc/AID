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
const axios = require("axios");
// const http = require("http");
let env, uri, client;
let players, reviews, users, games;
const { playerAPI, reviewAPI, userAPI, gameAPI } = require("./classAPIs");
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
      players = client.db(env.db).collection("players");
      reviews = client.db(env.db).collection("reviews");
      users = client.db(env.db).collection("users");
      games = client.db(env.db).collection("games");
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



