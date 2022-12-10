"use strict";

const axios = require("axios");
// const { EntityNotFoundError } = require("./error");
const { writeFileSync, readFileSync } = require("fs");

// const HTTP_METHOD = {
//   GET: "get",
// };

(async function () {
  for (let index = 1; index < 40; index++) {
    const BASE_URL = `https://www.balldontlie.io/api/v1/players?page=${index}&per_page=100`;
    await axios
      .get(BASE_URL)
      .then((res) => {
        const new_data = res.data.data;
        console.log(res.data.meta);
        let data_update;
        try {
          data_update = JSON.parse(readFileSync("./player.json"));
          //   what's it after parse?
          data_update.push(new_data);
        } catch (error) {
          console.log(error);
          data_update = new_data;
        }
        data_update = JSON.stringify(data_update);
        return writeFileSync("player.json", data_update);
      })
      .catch((err) => {
        console.error("[writefile sync]", err);
      });
  }
})();
