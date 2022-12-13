"use strict";
const port = 3020;
const path = require("path");
const axios = require("axios");
const filePath = path.join(__dirname, "/config.json");
const express = require("express");
const { MongoClient, ObjectId, Int32 } = require("mongodb");
const {
  promises: { readFile },
} = require("fs");
const bodyParser = require("body-parser");
let env, uri, client;
let players, reviews, users, games;
const app = express();
class playerAPI {
  constructor() {}
  static async getPlayerbyId(pid) {
    return await players
      .findOne({
        _id: ObjectId(pid),
      })
      .then((player) => {
        if (player) {
          return player;
        } else {
          console.log(`playerID404:${pid}`);
          return null;
        }
      });
  }

  static async getRecentRevs(pid) {
    return await playerAPI.getPlayerbyId(pid).then((player) => {
      return player ? player.recent_revs : null;
    });
  }
  static async getPlayerRating(pid) {
    return await playerAPI.getPlayerbyId(pid).then((player) => {
      return player ? player.ave_rating : null;
    });
  }

  static async PlayerfName(pid) {
    return await playerAPI.getPlayerbyId(pid).then((player) => {
      return player ? player.first_name : null;
    });
  }
  static async PlayerlName(pid) {
    return await playerAPI.getPlayerbyId(pid).then((player) => {
      return player ? player.last_name : null;
    });
  }
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
          ave_rating: rating,
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
            recent_revs: rid,
          },
        }
      )
      .then((_) => {
        return rid;
      });
  }

  static async getRecentReviews(pid) {
    return await playerAPI.getPlayerbyId(pid).then((player) => {
      if (player) {
        const rids = player.recent_revs;
      }
    });
  }
}

class reviewAPI {
  constructor() {}
  static async getReviewById(rid) {
    return await reviews
      .findOne({
        _id: ObjectId(rid),
      })
      .then((review) => {
        if (review) {
          return review;
        } else {
          console.log(`reviewID404:${rid}`);
          return null;
        }
      });
  }
  static async belongGame(rid) {
    return await reviewAPI.getReviewById(rid).then((review) => {
      return review ? review.game : null;
    });
  }
  static async gameStats(rid) {
    return await reviewAPI.getReviewById(rid).then((review) => {
      return review ? review.stats : null;
    });
  }
  static async getRating(rid) {
    return await reviewAPI.getReviewById(rid).then((review) => {
      return review ? review.rating : null;
    });
  }
  static async getComment(rid) {
    return await reviewAPI.getReviewById(rid).then((review) => {
      return review ? review.comment : null;
    });
  }
  static async getVotes(rid) {
    return await reviewAPI.getReviewById(rid).then((review) => {
      return review ? review.votes : null;
    });
  }
  static async upVote(rid) {
    // upvote this
  }
  static async downVote(rid) {
    // downvote this
  }
  static async isShadow(rid) {
    return await reviewAPI.getReviewById(rid).then((review) => {
      return review ? review.shadow : null;
    });
  }

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
  static async getUserById(uid) {
    return await users
      .findOne({
        _id: ObjectId(uid),
      })
      .then((user) => {
        if (user) {
          return user;
        } else {
          console.log(`userID404:${uid}`);
          return null;
        }
      });
  }
  static async userReviews(uid) {
    return await userAPI.getUserById(uid).then((user) => {
      return user ? user.reviews : null;
    });
  }
  static async userFollows(uid) {
    return await userAPI.getUserById(uid).then((user) => {
      return user ? user.follows : null;
    });
  }
  static async userName(uid) {
    return await userAPI.getUserById(uid).then((user) => {
      return user ? user.username : null;
    });
  }
  static async userPassword(uid) {
    return await userAPI.getUserById(uid).then((user) => {
      return user ? user.password : null;
    });
  }
  static async createUser() {
    // TODO:create a user here
  }
  static async writeReview() {
    // TODO:user write a review, replicate from shadow review
  }
  static async startFollow() {
    // TODO:user start to follow a player
  }
  static async unFollow() {
    // TODO:user stop follow one player
  }
  static async changePwd() {
    // TODO:user  changes password
  }
}

class gameAPI {
  constructor() {}
  static async getGameById(gid) {
    return await games
      .findOne({
        _id: ObjectId(gid),
      })
      .then((user) => {
        if (user) {
          return user;
        } else {
          console.log(`userID404:${gid}`);
          return null;
        }
      });
  }
  static async getHome(gid) {
    return await gameAPI.getGameById(gid).then((game) => {
      return game ? game.team_home : null;
    });
  }
  static async getAway(gid) {
    return await gameAPI.getGameById(gid).then((game) => {
      return game ? game.team_away : null;
    });
  }
  static async getOutcome(gid) {
    return await gameAPI.getGameById(gid).then((game) => {
      return game ? game.outcome : null;
    });
  }
  static async getTime(gid) {
    return await gameAPI.getGameById(gid).then((game) => {
      return game ? game.time : null;
    });
  }
  static async getGamePlayers(gid) {
    return await gameAPI.getGameById(gid).then((game) => {
      return game ? game.players : null;
    });
  }
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
        await gameAPI.updateGameOutcome(
          gid,
          team_home.points,
          team_away.points
        );
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
  static async updateGameOutcome(gid, h_pts, a_pts) {
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

class dailyAPI {
  constructor(date) {
    this.game_stack = [];
    this.postgame_reviews = [];
    this.YYYY = date.getFullYear();
    this.MM = date.getMonth() + 1;
    this.DD = date.getDate();
    this.GameSchedules24hour();
    this.GameOutcomes24hour();
  }

  GameSchedules = () => {
    // Get today's game schedules
    gameAPI
      .getSchedule(this.YYYY, this.MM, this.DD, env.api_key)
      .then((gameids) => {
        gameids.forEach((gid) => {
          this.game_stack.push(gid);
        });
      })
      .catch((err) => {
        console.error("[GameSchedules]", err);
      });
  };
  GameSchedules24hour = () => {
    let initialExecutionTime = new Date();
    initialExecutionTime.setHours(4);
    initialExecutionTime.setMinutes(0);
    initialExecutionTime.setSeconds(0);
    this.GameSchedules();
    setTimeout(function () {
      // FIXME: the scope problem, callee deprecated
      // execute this at 4:00 AM everyday
      this.GameSchedules();
      // repeat every 24 hour
      setInterval(this.GameSchedules(), 24 * 60 * 60 * 1000);
    }, initialExecutionTime - Date.now());
  };

  GameOutcomes = async () => {
    if (this.game_stack) {
      // update game outcomes
      while (this.game_stack) {
        const game_id = this.game_stack.pop();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.postgame_reviews.push(
          await gameAPI.postGame(game_id, env.api_key)
        );
      }
    }
  };

  GameOutcomes24hour = () => {
    let initialExecutionTime = new Date();
    initialExecutionTime.setHours(22);
    initialExecutionTime.setMinutes(0);
    initialExecutionTime.setSeconds(0);
    this.GameOutcomes();
    setTimeout(function () {
      // execute this at 10:00 PM everyday
      this.GameOutcomes();
      // repeat every 24 hour
      setInterval(this.GameOutcomes(), 24 * 60 * 60 * 1000);
    }, initialExecutionTime - Date.now());
  };
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
  /*   const dailyGames = new dailyAPI(new Date());
    let newgames_unplayed = dailyGames.game_stack;
  let postgame_reviews = dailyGames.postgame_reviews;
  app.use(bodyParser.json()); */

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });
  app.listen(port);
})();
