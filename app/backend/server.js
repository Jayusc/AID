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
let players, reviews, users, games;
const { playerAPI, reviewAPI, userAPI, gameAPI } = require("./classAPIs");
const app = express();

const { graphql, buildSchema } = require('graphql');
const schema = buildSchema(`
  type Player {
    playerID: ID!
    RecentGames: [Review]
    AverageRating: float
    Name: String
    Age: Int
    Team: String
    CareerStats: Object
  }
 
  type Review {
    player: [Player]
    reviewID: ID!
    game: Game
    Stats: Object
    Ratings: float
    Comments: String
    votes: Int
    shadow: Boolean
  }

  type Game {
    gameID: ID!
    TeamHome: String
    TeamAway: String
    Outcome: Object
    Time: Date
    players: [Player]
  }

  type User {
    userID: ID!
    reviews: [Review]
    follows: [Player]
    username: String
    password: String
  }
`)

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
