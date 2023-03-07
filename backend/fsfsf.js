const axios = require("axios");

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "12cdf25c65754487b70db8abce0dea13",
  },
});

assembly
  .get(`/transcript/rn20dxaa4f-56b9-4f77-a54b-d1946b01e4ee`)
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));
