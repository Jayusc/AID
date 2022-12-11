"use strict";
const port = 3020;
const path = require("path");
const { readFile } = require("fs/promises");
const mongoose = require("mongoose");
const { model, Schema } = require("mongoose");
const { ObjectId } = require("mongodb");
const DB = "mongodb://admin:password@mongodb:27017";

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
  ratings: mongoose.Decimal128,
  comments: String,
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

// const teams = JSON.parse(readFileSync("./teams.json")).data;

(async function () {
  /*   for (const team of teams) {
    // use mongoose to write to mongodb
    await Team.create({
      _id: ObjectId(),
      abbreviation: team.abbreviation,
      city: team.city,
      name: team.name,
    });
  } */
  console.log("before read");
  const players = JSON.parse(await readFile("./players.json", "utf8"));
  console.log("after read");
  console.log(players.length);
  for (const player of players) {
    // write to mongodb
    const teamab = player.team.abbreviation;
    const tid = await Team.findOne({ abbreviation: teamab })._id;
    await Player.create({
      _id: ObjectId(),
      RecentGames: null,
      AverageRating: null,
      first_name: player.first_name,
      last_name: player.last_name,
      age: null,
      team: tid, //of the team
    });
  }
})();
