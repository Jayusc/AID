"use strict";
const path = require("path");
const axios = require("axios");
const filePath = path.join(__dirname, "/config.json");
const { MongoClient, ObjectId, Int32 } = require("mongodb");
const {
  promises: { readFile },
} = require("fs");
const bodyParser = require("body-parser");
let env, uri, client;
let players, reviews, users, games;
const timer = require("timers");


class playerAPI {
  constructor() {}
  static async findPlayerbyName(first_name, last_name) {
    // return player ID
    return await players
      .findOne({
        first_name: first_name,
        last_name: last_name,
      })
      .then((document) => {
        if (document) {
          return document._id;
        } else {
          console.log(`can't find ${first_name} ${last_name}`);
          return null;
        }
      })
      .catch((err) => {
        console.error("[findPlayerbyName]", err);
      });
  }
  static async updateRating(pid, rating) {
    // update rating from user
    return await players.updateOne(
      {
        _id: ObjectId(pid),
      },
      {
        $set: {
          average_rating: rating,
        },
      }
    );
  }

  static async appendReview(pid, rid) {
    // append new game review to this player, return review id
    return await players
      .updateOne(
        {
          _id: ObjectId(pid),
        },
        {
          $push: {
            recent_games: rid,
          },
        }
      )
      .then((_) => {
        return rid;
      });
  }
}

class reviewAPI {
  constructor() {}
  static async ShadowReview(pid, gid, playerstats) {
    // create a shadow review with no rating and comments. return review ID
    return await reviews
      .insertOne({
        _id: ObjectId(),
        player: pid,
        game: gid,
        stats: playerstats,
        ratings: null,
        comments: null,
        votes: null,
        shadow: true,
      })
      .then((created) => {
        const rid = created.insertedId;
        playerAPI.appendReview(pid, rid);
        return rid;
      });
    // when the game is locked, replace shadow review
  }
}

class userAPI {
  constructor() {}
}

class gameAPI {
  constructor() {}
  static async getSchedule(YYYY, MM, DD, KEY) {
    // Get game schedule from API,return a list of game IDs
    const GET_SCHE_URL = `https://api.sportradar.com/nba/trial/v7/en/games/${YYYY}/${MM}/${DD}/schedule.json?api_key=${KEY}`;
    const res = await axios.get(GET_SCHE_URL).then(async (res) => {
      const sched_games = res.data.games;
      // create these games in database
      let gids = [];
      for (const game of sched_games) {
        gids.push(
          await games
            .insertOne({
              _id: ObjectId(),
              third_id: game.id, //third party API's game id
              team_home: game.home.alias,
              team_away: game.away.alias,
              outcome: null,
              time: `${YYYY}-${MM}-${DD}`,
            })
            .then((_) => {
              return _.insertedId;
            })
            .catch((err) => {
              console.error("[insert games to db]", err);
            })
        );
      }
      return gids;
    });
    return res;
    /*     Promise.all(all_promises)
      .then((_) => {
        return res;
      })
      .catch((err) => {
        console.error("[get game schedule]", err);
      }); */
  }
  static async postGame(gid, KEY) {
    // update database, return a list of reviews(ID) or 404
    const game = await games.findOne({
      _id: ObjectId(gid),
    });
    // get game info to update game outcome
    const POST_GAME_URL = `https://api.sportradar.com/nba/trial/v7/en/games/${game.third_id}/summary.json?api_key=${KEY}`;
    return await axios
      .get(POST_GAME_URL)
      .then(async (res) => {
        const gameinfo = res.data;
        const [team_home, team_away] = [gameinfo.home, gameinfo.away];
        await gameAPI.updateGameScores(gid, team_home.points, team_away.points);
        /*  for every active player, update Game:players(ID)
       create a review, update Player:recent reviews 
       reviewAPI ================ playerAPI */
        const allplayers = team_home.players.concat(team_away.players);
        let rids = [];
        for (const player of allplayers) {
          if (player.not_playing_reason) continue;
          rids.push(
            await playerAPI
              .findPlayerbyName(player.first_name, player.last_name)
              .then((pid) => {
                if (pid) {
                  gameAPI.fillGamePlayer(gid, pid);
                  // create a shadow review
                  const stats = player.statistics;
                  const playerstats = {
                    minutes: stats.minutes,
                    points: stats.points,
                    rebounds: stats.rebounds,
                    assists: stats.assists,
                    steals: stats.steals,
                    blocks: stats.blocks,
                    turnovers: stats.turnovers,
                  };
                  return reviewAPI.ShadowReview(pid, gid, playerstats);
                } else {
                  // don't create review for no ppl
                  return "Player 404";
                }
              })
              .catch((err) => {
                console.error("[Shadow Review]", err);
              })
          );
        }
        return rids;
      })
      .then((rids) => {
        return rids;
      })
      .catch((err) => {
        console.error("[should return a list of reviews]", err);
      });
  }
  static async updateGameScores(gid, h_pts, a_pts) {
    // update game scores, return game ID
    games
      .updateOne(
        {
          _id: gid,
        },
        {
          $set: {
            outcome: { home: h_pts, away: a_pts },
          },
        }
      )
      .then((_) => {
        return _.upsertedId;
      })
      .catch((err) => {
        console.error("[class API: gameScores]", err);
      });
  }
  static async fillGamePlayer(gid, pid) {
    // add played players to the game
    return games
      .updateOne(
        {
          _id: ObjectId(gid),
        },
        {
          $push: {
            players: pid,
          },
        }
      )
      .then((doc) => {
        return doc.upsertedId;
      });
  }
}

(async function () {
  await readFile(filePath)
    .then((file) => {
      env = JSON.parse(file);
      uri = `mongodb://${env.user}:${env.password}@${env.host}:${env.port}`;
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
  const today = new Date();
  const [YYYY, MM, DD] = [
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate() - 1,
  ];
  gameAPI.getSchedule(YYYY, MM, DD, env.api_key).then(async (gameids) => {
    let rids = [];
    for (const game_id of gameids) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      //   await sleep(1000);
      rids.push(await gameAPI.postGame(game_id, env.api_key));
    }
    console.log(rids); //review IDs
  });
})();
