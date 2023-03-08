const axios = require("axios");
const fs = require("fs");

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "12cdf25c65754487b70db8abce0dea13",
  },
});

assembly
  .get(`/transcript/rvrs82f6xl-b87d-491f-a088-46d380630459`)
  .then((res) => {
    console.log(res.data.entities);
  })
  .catch((err) => console.error(err));
