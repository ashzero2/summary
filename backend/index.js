const express = require("express");
const axios = require("axios");
const cors = require("cors");
const ytdl = require("ytdl-core");
const fs = require("fs");

const app = express();
app.use(cors());
const port = 3100;

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "12cdf25c65754487b70db8abce0dea13",
    "transfer-encoding": "chunked",
  },
});

const getID = (UPLOAD_URL) => {
  console.log("getID");
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
      console.log(res.data.id);
      fs.writeFile("link.txt", res.data.id, (err) => {
        if (err) throw err;
      });
    })
    .catch((err) => console.error(err));
};

app.get("/download/:url", (req, res) => {
  const link = `https://youtu.be/${req.params.url}`;
  ytdl(link, { filter: "audioonly" }).pipe(fs.createWriteStream("audio.mp4"));
  console.log("\nDownloaded video");
  res.send("DONE");
});

app.get("/upload", (req, res) => {
  const file = "audio.mp4";

  fs.readFile(file, async (err, data) => {
    if (err) return console.error(err);

    assembly
      .post("/upload", data)
      .then((res) => {
        let UPLOAD_URL = res.data.upload_url;
        getID(UPLOAD_URL);
      })
      .catch((err) => console.error(err));
  });
});

app.get("/getLink", (req, res) => {
  fs.readFile("link.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      retyurn;
    }
    res.send({ video_link: data });
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
