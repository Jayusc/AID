"use strict";
function clone(a) {
  return JSON.parse(JSON.stringify(a));
}

const { ObjectId } = require("mongodb");

class playerAPI {
  constructor() {}
  static async findPlayerbyName(first_name, last_name) {
    // return player ID
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
    // append new game review to this player
    return await players.updateOne(
      {
        _id: ObjectId(pid),
      },
      {
        $push: {
          recent_games: rid,
        },
      }
    );
  }
}

class reviewAPI {
  constructor() {}
  static async ShadowReview(pid, gid, playerstats) {
    // create a shadow review with no rating and comments. return review ID
    const created = await reviews.insertOne({
      _id: ObjectId(),
      player: pid,
      game: gid,
      stats: playerstats,
      ratings: null,
      comments: null,
      votes: null,
      shadow: true,
    });
    return created.insertedId;
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
    let res = [];
    await axios
      .get(GET_SCHE_URL)
      .then(async (res) => {
        const sched_games = res.data.games;
        // create these games in database
        for (const game of sched_games) {
          const stored = await games.insertOne({
            _id: ObjectId(),
            third_id: game.id, //third party API's game id
            team_home: game.home.alias,
            team_away: game.away.alias,
            outcome: null,
            time: `${YYYY}-${MM}-${DD}`,
            players: null,
          });
          res.push(stored.insertedId);
        }
      })
      .then((_) => {
        return res;
      })
      .catch((err) => {
        console.error("[get game schedule]", err);
      });
  }
  static async postGame(gid, KEY) {
    // update database, return a list of reviews(ID)
    const game = await games.findOne({
      _id: ObjectId(gid),
    });
    // get game info to update game outcome
    const POST_GAME_URL = `https://api.sportradar.com/nba/trial/v7/en/games/${game.third_id}/summary.json?api_key=${KEY}`;
    let rids = [],
      pids = [];
    await axios.get(POST_GAME_URL).then(async (res) => {
      const gameinfo = res.data;
      const [team_home, team_away] = [gameinfo.home, gameinfo.away];
      gameAPI.updateGameScores(gid, team_home.points, team_away.points);
      /*  for every active player, update Game:players(ID)
     create a review, update Player:recent reviews 
     reviewAPI ================ playerAPI */
      const allplayers = team_home.players.concat(team_away.players);
      let loopPromises = [];
      for (const player of allplayers) {
        if (player.not_playing_reason) continue;
        loopPromises.push(
          playerAPI
            .findPlayerbyName(player.first_name, player.last_name)
            .then((pid) => {
              // create a shadow review
              pids.push(pid);
              stats = player.statistics;
              playerstats = {
                minutes: stats.minutes,
                points: stats.points,
                rebounds: stats.rebounds,
                assists: stats.assists,
                steals: stats.steals,
                blocks: stats.blocks,
                turnovers: stats.turnovers,
              };
              return reviewAPI.ShadowReview(pid, gid, playerstats);
            })
            .then((rid) => {
              rids.push(rid);
              return playerAPI.appendReview(pid, rid);
            })
            .catch((err) => console.log(err))
        );
      }
      Promise.all(loopPromises)
        .then(() => {
          return gameAPI.fillGamePlayers(gid, pids);
        })
        .then(() => {
          return rids;
        })
        .catch((err) => {
          console.error("[Promise all]", err);
        });
    });
  }
  static async updateGameScores(gid, h_pts, a_pts) {
    // update game scores
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
      .then((_) => {})
      .catch((err) => {
        console.error("[class API: gameScores]", err);
      });
  }
  static async fillGamePlayers(gid, pids) {
    // add played players to the game
    games.updateOne(
      {
        _id: ObjectId(gid),
      },
      {
        $set: {
          players: pids,
        },
      }
    );
  }
}

module.exports = {
  playerAPI,
  reviewAPI,
  userAPI,
  gameAPI,
};
