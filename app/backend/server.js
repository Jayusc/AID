"use strict";
const port = 3020;
const path = require("path");
const filePath = path.join(__dirname, "/config.json");
const express = require("express");
const {MongoClient} = require("mongodb");
const {
    promises: {readFile},
} = require("fs");
const bodyParser = require("body-parser");
const axios = require("axios");
// const http = require("http");
let env, uri, client;

const app = express();

(async function () {
    await readFile(filePath)
        .then((file) => {
            env = JSON.parse(file);
            uri = `mongodb://${env.host}:${env.port}`;
            client = new MongoClient(uri);
            return client.connect();
        })
        .then((_) => {
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

app.post("/games", async (req, res) => {
    const data = await axios.get("http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard")
    let output = {
        GameID : "",
        TeamHome: "",
        TeamAway: "",
        Outcome: null,
        Time: null,
        Players: []
    }
    output.GameID = data.data.events[0].id
    output.TeamHome = data.data.events[0].competitions[0].competitors[0].displayName
    output.TeamAway = data.data.events[0].competitions[0].competitors[1].displayName
    output.Outcome = data.data.

})

