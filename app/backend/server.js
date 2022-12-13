"use strict";
const port = 3020;
const path = require("path");
const axios = require("axios");
const filePath = path.join(__dirname, "/config.json");
const express = require("express");
const { MongoClient, ObjectId, Int32 } = require("mongodb");
const { graphqlHTTP } = require("express-graphql");
const DataLoader = require("dataloader");
const {
  readFileSync,
  promises: { readFile },
} = require("fs");
const bodyParser = require("body-parser");
const {
  assertResolversPresent,
  makeExecutableSchema,
} = require("@graphql-tools/schema");
let env, uri, client;
const app = express();
class playerAPI {
  constructor() {}
  static async getPlayerbyId(db, pid) {
    const players = db.collection("players");
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

  static async getAllPlayers(db) {
    return await db
      .collection("players")
      .find()
      .map((p) => p._id)
      .toArray();
  }

  static async getRecentRevs(db, pid) {
    return await playerAPI.getPlayerbyId(db, pid).then((player) => {
      return player ? player.recent_revs : null;
    });
  }
  static async getPlayerRating(db, pid) {
    return await playerAPI.getPlayerbyId(db, pid).then((player) => {
      return player ? player.ave_rating : null;
    });
  }

  static async PlayerfName(db, pid) {
    return await playerAPI.getPlayerbyId(db, pid).then((player) => {
      return player ? player.first_name : null;
    });
  }
  static async PlayerlName(db, pid) {
    return await playerAPI.getPlayerbyId(db, pid).then((player) => {
      return player ? player.last_name : null;
    });
  }
  static async findPlayerbyName(db, first_name, last_name) {
    // return player ID
    const players = db.collection("players");
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

  static async updateRating(db, pid, rating) {
    // update rating from user
    const players = db.collection("players");
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

  static async appendReview(db, pid, rid) {
    // append new game review to this player, return review id
    const players = db.collection("players");
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

  static async getRecentReviews(db, pid) {
    return await playerAPI.getPlayerbyId(db, pid).then((player) => {
      return player ? player.recent_revs : null;
    });
  }
}

class reviewAPI {
  constructor() {}
  static async getReviewById(db, rid) {
    const reviews = db.collection("reviews");
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
  static async getAllReviews(db) {
    return await db
      .collection("reviews")
      .find()
      .map((p) => p._id)
      .toArray();
  }
  static async belongPlayer(db, rid) {
    return await reviewAPI.getReviewById(db, rid).then((review) => {
      return review ? review.player : null;
    });
  }
  static async belongGame(db, rid) {
    return await reviewAPI.getReviewById(db, rid).then((review) => {
      return review ? review.game : null;
    });
  }
  static async playerStats(db, rid) {
    return await reviewAPI.getReviewById(db, rid).then((review) => {
      return review ? review.stats : null;
    });
  }
  static async getRating(db, rid) {
    return await reviewAPI.getReviewById(db, rid).then((review) => {
      return review ? review.rating : null;
    });
  }
  static async getComment(db, rid) {
    return await reviewAPI.getReviewById(db, rid).then((review) => {
      return review ? review.comment : null;
    });
  }
  static async getVotes(db, rid) {
    return await reviewAPI.getReviewById(db, rid).then((review) => {
      return review ? review.votes : null;
    });
  }
  static async upVote(db, rid) {
    // upvote this review
    const reviews = db.collection("reviews");
    const previous_votes = await reviewAPI.getVotes(db, rid);
    return await reviews
      .updateOne(
        {
          _id: ObjectId(rid),
        },
        {
          votes: previous_votes + 1,
        }
      )
      .then((_) => {
        return previous_votes + 1;
      });
  }
  static async downVote(db, rid) {
    // downvote this review
    const reviews = db.collection("reviews");
    const previous_votes = await reviewAPI.getVotes(db, rid);
    return await reviews
      .updateOne(
        {
          _id: ObjectId(rid),
        },
        {
          votes: previous_votes - 1,
        }
      )
      .then((_) => {
        return previous_votes - 1;
      });
  }
  static async isShadow(db, rid) {
    return await reviewAPI.getReviewById(db, rid).then((review) => {
      return review ? review.shadow : null;
    });
  }
  static async getShadow(db, pid, gid) {
    return db.collection("reviews").find({player: pid, game: gid}).then((doc) => {
      return doc._id;
    });
  }

  static async ShadowReview(db, pid, gid, playerstats) {
    // create a shadow review with no rating and comments. return review ID
    const reviews = db.collection("reviews");
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
        playerAPI.appendReview(db, pid, rid);
        return rid;
      });
    // when the game is locked, replace shadow review
  }
  static async newReview(db, pid, gid, uid, shadow_review_id, new_comment, new_rating) {
    // create a new review with new rating and comments. return review ID
    const reviews = db.collection("reviews");
    const playerstats = reviewAPI.playerStats(db, shadow_review_id);
    return await reviews
      .insertOne({
        _id: ObjectId(),
        player: pid,
        game: gid,
        stats: playerstats,
        ratings: new_rating,
        comments: new_comment,
        votes: 0,
        shadow: false,
      })
      .then((created) => {
        const rid = created.insertedId;
        playerAPI.appendReview(db, pid, rid);
        userAPI.writeReview(db, uid, rid)
        return rid;
      });
  }
}

class userAPI {
  constructor() {}
  static async getUserById(db, uid) {
    return await db
      .collection("users")
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
  static async getAllUsers(db) {
    return await db
      .collection("users")
      .find()
      .map((p) => p._id)
      .toArray();
  }
  static async userReviews(db, uid) {
    return await userAPI.getUserById(db, uid).then((user) => {
      return user ? user.reviews : null;
    });
  }
  static async userFollows(db, uid) {
    return await userAPI.getUserById(db, uid).then((user) => {
      return user ? user.follows : null;
    });
  }
  static async userName(db, uid) {
    return await userAPI.getUserById(db, uid).then((user) => {
      return user ? user.username : null;
    });
  }
  static async userPassword(db, uid) {
    return await userAPI.getUserById(db, uid).then((user) => {
      return user ? user.password : null;
    });
  }
  static async createUser(db, username, password) {
    // create a new user
    const users = db.collection("users");
    return await users
      .insertOne({
        _id: ObjectId(),
        username: username,
        password: password,
      })
      .then((created) => {
        const uid = created.insertedId;
        return uid;
      });
  }
  static async writeReview(db, uid, rid) {
    // append new game review to this user, return review id
    const users = db.collection("users");
    return await users
      .updateOne(
        {
          _id: ObjectId(uid),
        },
        {
          $push: {
            reviews: rid,
          },
        }
      )
      .then((_) => {
        return rid;
      });
  }
  static async startFollow(db, pid, uid) {
    // user start to follow a player
    const users = db.collection("users");
    return await users
      .updateOne(
        {
          _id: ObjectId(uid),
        },
        {
          $push: {
            follows: pid,
          },
        }
      )
      .then((_) => {
        return playerAPI.getPlayerbyId(db, pid)
      })
      .then((player) => {
        return player.follows;
      });
  }
  static async unFollow(db, pid, uid) {
    // user stop following a player
    const users = db.collection("users");
    return await users
      .updateOne(
        {
          _id: ObjectId(uid),
        },
        {
          $pull: {
            follows: pid,
          },
        }
      )
      .then((_) => {
        return playerAPI.getPlayerbyId(db, pid)
      })
      .then((player) => {
        return player.follows;
      });
  }
  static async changePwd(db, uid, new_password) {
    // user changes password
    const users = db.collection("users");
    return await users
      .updateOne(
        {
        _id: ObjectId(uid),
        },
        {
          password: new_password
        }
      )
      .then(() => {
        return uid;
      });
  }
}

class gameAPI {
  constructor() {}
  static async getGameById(db, gid) {
    return await db
      .collection("games")
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
  static async getAllGames(db) {
    return await db
      .collection("games")
      .find()
      .map((p) => p._id)
      .toArray();
  }
  static async getGamebyDate(db, date) {
    return await db
      .collection("games")
      .find({ time: date })
      .map((p) => p._id)
      .toArray();
  }
  static async getHome(db, gid) {
    return await gameAPI.getGameById(db, gid).then((game) => {
      return game ? game.team_home : null;
    });
  }
  static async getAway(db, gid) {
    return await gameAPI.getGameById(db, gid).then((game) => {
      return game ? game.team_away : null;
    });
  }
  static async getOutcome(db, gid) {
    return await gameAPI.getGameById(db, gid).then((game) => {
      return game ? game.outcome : null;
    });
  }
  static async getTime(db, gid) {
    return await gameAPI.getGameById(db, gid).then((game) => {
      return game ? game.time : null;
    });
  }
  static async getGamePlayers(db, gid) {
    return await gameAPI.getGameById(db, gid).then((game) => {
      return game ? game.players : null;
    });
  }
  static async getSchedule(db, YYYY, MM, DD, KEY) {
    // Get game schedule from API,return a list of game IDs
    const GET_SCHE_URL = `https://api.sportradar.com/nba/trial/v7/en/games/${YYYY}/${MM}/${DD}/schedule.json?api_key=${KEY}`;
    const res = await axios.get(GET_SCHE_URL).then(async (res) => {
      const sched_games = res.data.games;
      // create these games in database
      let gids = [];
      for (const game of sched_games) {
        gids.push(
          await db
            .collection("games")
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
  static async postGame(db, gid, KEY) {
    // update database, return a list of reviews(ID) or 404
    const game = await gameAPI.getGameById(db, gid);
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
              .findPlayerbyName(db, player.first_name, player.last_name)
              .then((pid) => {
                if (pid) {
                  gameAPI.fillGamePlayer(db, gid, pid);
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
                  return reviewAPI.ShadowReview(db, pid, gid, playerstats);
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
  static async updateGameOutcome(db, gid, h_pts, a_pts) {
    // update game scores, return game ID
    return await db
      .collection("games")
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
  static async fillGamePlayer(db, gid, pid) {
    // add played players to the game
    return db
      .collection("games")
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

const { graphql } = require('graphql');

(async function () {
  await readFile(filePath)
    .then((file) => {
      env = JSON.parse(file);
      uri = `mongodb://${env.user}:${env.password}@${env.host}:${env.port}`;
      client = new MongoClient(uri);
      return client.connect();
    })
    .then((_) => {
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
  const typeDefs = readFileSync("./schema.graphql").toString("utf-8");
  const resolvers = require("./resolvers");
  const schema = makeExecutableSchema({
    resolvers,
    resolverValidationOptions: {
      requireResolversForAllFields: "warn",
      requireResolversToMatchSchema: "warn",
    },
    typeDefs,
  });
  app.use(
    "/graphql",
    graphqlHTTP(async (req) => {
      return {
        schema,
        graphiql: true,
        context: {
          db: client.db(env.db),
          playerAPI: playerAPI,
          gameAPI: gameAPI,
          reviewAPI: reviewAPI,
          userAPI: userAPI,
          loaders: {
            player: new DataLoader((keys) =>
              loadPlayers(client.db(env.db), keys)
            ),
            review: new DataLoader((keys) =>
              loadReviews(client.db(env.db), keys)
            ),
            user: new DataLoader((keys) => loadUsers(client.db(env.db), keys)),
            game: new DataLoader((keys) => loadGames(client.db(env.db), keys)),
          },
        },
      };
    })
  );

  app.listen(port);
  console.log(`GraphQL API server running at http://localhost:${port}/graphql`);
})();
async function loadPlayers(db, keys) {
  const players = await db.collection("players").find().toArray();
  const result = players.reduce((acc, document) => {
    acc[document._id] = document;
    return acc;
  }, {});
  return keys.map(
    (key) => result[key] || new Error(`player [${key}] does not exist `)
  );
}

async function loadReviews(db, keys) {
  const reviews = await db.collection("reviews").find().toArray();
  const result = reviews.reduce((acc, document) => {
    acc[document._id] = document;
    return acc;
  }, {});
  return keys.map(
    (key) => result[key] || new Error(`review [${key}] does not exist `)
  );
}

async function loadUsers(db, keys) {
  const users = await db.collection("users").find().toArray();
  const result = users.reduce((acc, document) => {
    acc[document._id] = document;
    return acc;
  }, {});
  return keys.map(
    (key) => result[key] || new Error(`user [${key}] does not exist `)
  );
}

async function loadGames(db, keys) {
  const games = await db.collection("games").find().toArray();
  const result = games.reduce((acc, document) => {
    // console.log(index++, typeof document, typeof document._id, typeof acc);
    acc[document._id.toString()] = document;
    return acc;
  }, {});
  return keys.map(
    (key) => result[key] || new Error(`game [${key}] does not exist `)
  );
}
