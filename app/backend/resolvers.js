"use strict";

const resolvers = {
  Player: {
    pid: ({ _id }, _, context) => {
      return _id;
    },
    recent_reviews: ({ _id }, _, context) => {
      return context.playerAPI.getRecentRevs(context.db, _id).then((rids) => {
        return rids.map((rid) =>
          context.reviewAPI.getReviewById(context.db, rid)
        );
      });
    },
    average_rating: ({ _id }, _, context) => {
      return context.playerAPI.getPlayerRating(context.db, _id);
    },
    fname: ({ _id }, _, context) => {
      return context.playerAPI.PlayerfName(context.db, _id);
    },
    lname: ({ _id }, _, context) => {
      return context.playerAPI.PlayerlName(context.db, _id);
    },
    name: async ({ _id }, _, context) => {
      const fname = context.playerAPI.PlayerfName(context.db, _id);
      const lname = context.playerAPI.PlayerlName(context.db, _id);
      return await Promise.all([fname, lname]).then(([f, l]) => {
        return f + " " + l;
      });
    },
  },
  Review: {
    rid: ({ _id }, _, context) => {
      return _id;
    },
    player: ({ _id }, _, context) => {
      return context.reviewAPI.belongPlayer(context.db, _id).then((pid) => {
        return context.loaders.player.load(pid);
      });
    },
    game: ({ _id }, _, context) => {
      return context.reviewAPI.belongGame(context.db, _id).then((gid) => {
        return context.loaders.game.load(gid);
      });
    },
    stats: ({ _id }, _, context) => {
      return context.reviewAPI.playerStats(context.db, _id);
    },
    ratings: ({ _id }, _, context) => {
      return context.reviewAPI.getRating(context.db, _id);
    },
    comments: ({ _id }, _, context) => {
      return context.reviewAPI.getComment(context.db, _id);
    },
    votes: ({ _id }, _, context) => {
      return context.reviewAPI.getVotes(context.db, _id);
    },
    shadow: ({ _id }, _, context) => {
      return context.reviewAPI.isShadow(context.db, _id);
    },
  },
  Game: {
    gid: ({ _id }, _, context) => {
      return _id;
    },
    team_Home: ({ _id }, _, context) => {
      return context.gameAPI.getHome(context.db, _id);
    },
    team_Away: ({ _id }, _, context) => {
      return context.gameAPI.getAway(context.db, _id);
    },
    outcome: ({ _id }, _, context) => {
      return context.gameAPI.getOutcome(context.db, _id);
    },
    time: ({ _id }, _, context) => {
      return context.gameAPI.getTime(context.db, _id);
    },
    players: async ({ _id }, _, context) => {
      let players = [];
      const playerIds = await context.gameAPI.getGamePlayers(context.db, _id);
      for (const playerId of playerIds)
        players.push(
          await context.playerAPI.getPlayerbyId(context.db, playerId)
        );
      return players;
    },
  },
  User: {
    uid: ({ _id }, _, context) => {
      return _id;
    },
    reviews: ({ _id }, _, context) => {
      return context.userAPI.userReviews(context.db, _id);
    },
    follows: ({ _id }, _, context) => {
      return context.userAPI.userFollows(context.db, _id);
    },
    username: ({ _id }, _, context) => {
      return context.userAPI.userName(context.db, _id);
    },
    password: ({ _id }, _, context) => {
      return context.userAPI.userPassword(context.db, _id);
    },
  },
  Stats: {
    minutes: ({ minutes }, _, context) => {
      return minutes;
    },
    points: ({ points }, _, context) => {
      return points;
    },
    rebounds: ({ rebounds }, _, context) => {
      return rebounds;
    },
    assists: ({ assists }, _, context) => {
      return assists;
    },
    steals: ({ steals }, _, context) => {
      return steals;
    },
    blocks: ({ blocks }, _, context) => {
      return blocks;
    },
    turnovers: ({ turnovers }, _, context) => {
      return turnovers;
    },
  },
  Outcome: {
    home: ({ home }, _, context) => {
      return home;
    },
    away: ({ away }, _, context) => {
      return away;
    },
  },
  Query: {
    player: (_, { pid }, context) => {
      return context.loaders.player.load(pid);
    },
    review: (_, { rid }, context) => {
      return context.loaders.review.load(rid);
    },
    reviews: async (_, { limit = 20 }, context) => {
      return await context.reviewAPI
        .getAllReviews(context.db)
        .then((idList) => {
          return idList
            ? idList.map((id) => context.loaders.review.load(id))
            : null;
        })
        .then((reviewList) => {
          return reviewList ? reviewList.slice(0, limit) : null;
        });
    },
    game: (_, { gid }, context) => {
      return context.loaders.game.load(gid);
    },
    games: async (_, { date, limit = 20 }, context) => {
      let idList = [];
      idList = date
        ? await context.gameAPI.getGamebyDate(context.db, date)
        : await context.gameAPI.getAllGames(context.db);
      return await Promise.all([idList])
        .then((promiseList) => {
          const gidList = promiseList[0];
          return gidList
            .map((id) => context.loaders.game.load(id))
            .slice(0, limit);
        })
        .catch((err) => console.log(err));
    },
    user: (_, { uid }, context) => {
      return context.loaders.user.load(uid);
    },
    topReview: async (_, { pid, gid }, context) => {
      return await context.reviewAPI
        .getTopReview(context.db, pid, gid)
        .then((highest_rid) => {
          return context.reviewAPI.getReviewById(context.db, highest_rid);
        });
    },
  },
  Mutation: {
    writeReview: async (
      _,
      { pid, gid, uid, new_comment, new_rating },
      context
    ) => {
      const shadow_review_id = await context.reviewAPI.getShadow(
        context.db,
        pid,
        gid
      );
      return context.reviewAPI
        .newReview(
          context.db,
          pid,
          gid,
          uid,
          shadow_review_id,
          new_comment,
          new_rating
        )
        .then((rid) => {
          context.loaders.review.clear(pid);
          context.loaders.user.clear(uid);
          return context.loaders.review.load(rid);
        });
    },
    createUser: async (_, { username, password }, context) => {
      return context.userAPI.createUser(context.db, username, password);
    },
    follow: async (_, { pid, uid }, context) => {
      return await context.userAPI
        .startFollow(context.db, pid, uid)
        .then((user_id) => {
          context.loaders.user.clear(user_id);
          return context.userAPI.userFollows(context.db, user_id);
        })
        .then((idList) => {
          return idList.map((id) => context.loaders.player.load(id));
        });
    },
    unfollow: async (_, { pid, uid }, context) => {
      return await context.userAPI
        .unFollow(context.db, pid, uid)
        .then((user_id) => {
          context.loaders.user.clear(user_id);
          return context.userAPI.userFollows(context.db, user_id);
        })
        .then((idList) => {
          return idList.map((id) => context.loaders.player.load(id));
        });
    },
    changePassword: async (_, { uid, new_password }, context) => {
      return context.userAPI
        .changePwd(context.db, uid, new_password)
        .then((uid) => {
          context.loaders.user.clear(uid);
          return uid;
        });
    },
    upVote: async (_, { rid }, context) => {
      return context.reviewAPI.upVote(context.db, rid);
    },
    downVote: async (_, { rid }, context) => {
      return context.reviewAPI.downVote(context.db, rid);
    },
  },
};

module.exports = resolvers;
