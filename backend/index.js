const express = require("express");
const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs");

const app = express();
const port = 3100;

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "12cdf25c65754487b70db8abce0dea13",
    "transfer-encoding": "chunked",
  },
});

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
      console.log(res.data);
    })
    .catch((err) => console.error(err));
};

app.get("/download/:url", (req, res) => {
  const link = `https://youtu.be/${req.params.url}`;
  ytdl(link, { filter: "audioonly" }).pipe(fs.createWriteStream("audio.mp4"));
});

app.get("/upload", (req, res) => {
  const file = "audio.mp4";

  fs.readFile(file, async (err, data) => {
    if (err) return console.error(err);

    assembly
      .post("/upload", data)
      .then((res) => {
        let UPLOAD_URL = res.data.upload_url;
        fs.writeFile("link.txt", UPLOAD_URL, (err) => {
          if (err) throw err;
        });
        console.log(UPLOAD_URL);
      })
      .catch((err) => console.error(err));
  });
});

app.get("/getLink", (req, res) => {
  fs.readFile("link.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
