"use strict";
const port = 3020;
const path = require("path");
const filePath = path.join(__dirname, "/config.json");
const express = require("express");
const {MongoClient} = require("mongodb");
const uuid = require("uuid")
const {
    promises: {readFile},
} = require("fs");
const bodyParser = require("body-parser");
const axios = require("axios");
// const http = require("http");
let env, uri, client;
let players, reviews, users, games;
const {playerAPI, reviewAPI, userAPI, gameAPI} = require("./classAPIs");
const {mongo} = require("mongoose");
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
            players = client.db(env.db).collection("players");
            reviews = client.db(env.db).collection("reviews");
            users = client.db(env.db).collection("users");
            games = client.db(env.db).collection("games");
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

app.post("/login", async (req, res) => {
    // 表单验证
    const email = req.body.email
    const password = req.body.password
    if (email === undefined || password === undefined) {
        res.status(400).json({"error": "Bad Request"})
        return
    }
    // 查数据库验证账号密码
    const userInfo = await mongo.DB.collection("users").findOne({email: email, password: parseInt(password)})
    if (!userInfo) {
        res.status(400).json({"error": "Password Error"})
        return
    }
    // 生成token
    const token = uuid.v4()
    // redis中保存用户
    const key = "login:token:" + token
    await mongo.DB.collection("users").insert({key:key, email:email})
    // await redisClient.expire(key, 1800)1800
    // 返回
    res.send({"token": token})
})

app.use(async (req, res, next) => {
    if (req.url === "/api/users/login") {
        next()
        return
    }
    const clientToken = req.headers.authorization
    if (clientToken === undefined) {
        res.status(400).send({"error": "UnAuthorized"})
        return
    }
    const key = "login:token:" + clientToken
    const user = await mongo.DB.collection("users").findOne({key: key})
    if (user.email === undefined) {
        res.status(400).send({"error": "UnAuthorized"})
        return
    }
    next()
})



