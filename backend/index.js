const express = require("express");
const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs");

const app = express();
const port = 3000;
let UPLOAD_URL = "default";

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "12cdf25c65754487b70db8abce0dea13",
    "transfer-encoding": "chunked",
  },
});

const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

const getEntity = () => {
  console.log("Entity\n");
  assembly
    .post("/transcript", {
      audio_url: UPLOAD_URL,
      summarization: true,
      summary_model: "informative",
      summary_type: "bullets",
      auto_highlights: true,
      entity_detection: true,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.error(err));
};

async function upFile() {
  const file = "audio.mp4";

  async function newFile() {
    fs.readFile(file, async (err, data) => {
      if (err) return console.error(err);

      await assembly
        .post("/upload", data)
        .then((res) => {
          UPLOAD_URL = res.data.upload_url;
          console.log(UPLOAD_URL);
        })
        .catch((err) => console.error(err));
    });
  }

  newFile().then((resp) => console.log(resp));
  return UPLOAD_URL;
}

app.get("/:url", async (req, res) => {
  const link = `https://youtu.be/${req.params.url}`;
  ytdl(link, { filter: "audioonly" }).pipe(fs.createWriteStream("audio.mp4"));

  const se = await upFile();
  console.log(se);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
