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
  RecentGames: [ObjectId], //of the reviews
  AverageRating: mongoose.Decimal128,
  first_name: String,
  last_name: String,
  age: Number,
  team: ObjectId, //of the team
  versionKey: false,
});

const reviewSchema = new Schema({
  _id: ObjectId,
  player: ObjectId, // of the player
  time: Date,
  stats: {},
  ratings: [mongoose.Decimal128],
  comments: [String],
  versionKey: false,
});

const userSchema = new Schema({
  _id: ObjectId,
  reviews: [ObjectId], //of the reviews
  follows: [ObjectId], //of the player
  //   follows_team:[ObjectId], // of the team
  username: String,
  password: String,
  versionKey: false,
});

const gameSchema = new Schema({
  _id: ObjectId,
  team_home: ObjectId, //of the team
  team_away: ObjectId,
  Outcome: {},
  time: Date,
  players: [ObjectId], //of the player
  versionKey: false,
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
  [YYYY, MM, DD] = [today.getFullYear(), today.getMonth() + 1, today.getDate()];
  GET_SCHE_URL = `https://api.sportradar.com/nba/trial/v7/en/games/${YYYY}/${MM}/${DD}/schedule.json?api_key=9npp4e85pcp8bv3bshmtpc7v`;
  await axios
    .get(GET_SCHE_URL)
    .then((res) => {
      const gschedule = res.data;
      console.log(gschedule);
      // write to database
    })
    .catch((err) => {
      console.error("[writefile sync]", err);
    });
})();
