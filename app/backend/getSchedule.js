"use strict";
const port = 3020;
const path = require("path");
const axios = require("axios");
const { readFile } = require("fs/promises");
const mongoose = require("mongoose");
const { model, Schema } = require("mongoose");
const { ObjectId } = require("mongodb");
const DB = "mongodb://admin:password@mongodb:27017";
let GET_SCHE_URL, YYYY, MM, DD;

mongoose
  .connect(DB)
  .then((_) => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

const playerSchema = new mongoose.Schema({
  _id: ObjectId,
  recent_games: [ObjectId], //of the reviews
  average_rating: mongoose.Decimal128,
  first_name: String,
  last_name: String,
  age: Number,
  team: ObjectId, //of the team
});

const reviewSchema = new Schema({
  _id: ObjectId,
  player: ObjectId, // of the player
  time: Date,
  stats: {},
  ratings: [mongoose.Decimal128],
  comments: [String],
});

const userSchema = new Schema({
  _id: ObjectId,
  reviews: [ObjectId], //of the reviews
  follows: [ObjectId], //of the player
  //   follows_team:[ObjectId], // of the team
  username: String,
  password: String,
});

const gameSchema = new Schema({
  _id: ObjectId,
  team_home: String,
  team_away: String,
  outcome: {},
  time: Date,
  players: [ObjectId], //of the player
});

const teamSchema = new Schema({
  _id: ObjectId,
  abbreviation: String,
  city: String,
  name: String,
  versionKey: false,
});

const [Player, Review, User, Game, Team] = [
  model("Player", playerSchema),
  model("Review", reviewSchema),
  model("User", userSchema),
  model("Game", gameSchema),
  model("Team", teamSchema),
];
(async function () {
  const today = new Date();
  [YYYY, MM, DD] = [
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate() + 1,
  ];
  GET_SCHE_URL = `https://api.sportradar.com/nba/trial/v7/en/games/${YYYY}/${MM}/${DD}/schedule.json?api_key=9npp4e85pcp8bv3bshmtpc7v`;
  await axios
    .get(GET_SCHE_URL)
    .then(async (res) => {
      const sched_games = res.data.games;
      // write to database
      for (const game of sched_games) {
        await Game.create({
          _id: ObjectId(),
          team_home: game.home.alias, //of the team
          team_away: game.away.alias,
          Outcome: null,
          time: YYYY + "-" + MM + "-" + DD,
          players: [ObjectId], //of the player
          versionKey: false,
        });
      }
    })
    .catch((err) => {
      console.error("[writefile sync]", err);
    });
})();
