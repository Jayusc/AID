"use strict";

const resolvers = {
  Player: {
    pid: ({ _id }, _, context) => {
      return _id;
    },
    recent_reviews: () => {},
    average_rating: () => {},
    fname: () => {},
    lname: () => {},
    name: () => {},
  },
  Review: {
    rid: () => {},
    player: () => {},
    game: () => {},
    stats: () => {},
    ratings: () => {},
    comments: () => {},
    votes: () => {},
    shadow: () => {},
  },
  Game: {
    gid: () => {},
    team_Home: () => {},
    team_Away: () => {},
    outcome: () => {},
    time: () => {},
    players: () => {},
  },
  User: {
    uid: () => {},
    reviews: () => {},
    follows: () => {},
    username: () => {},
    password: () => {},
  },
  Stats: {
    minutes: () => {},
    points: () => {},
    rebounds: () => {},
    assists: () => {},
    steals: () => {},
    blocks: () => {},
    turnovers: () => {},
  },
  Outcome: {
    home: () => {},
    away: () => {},
  },
};

module.exports = resolvers;
