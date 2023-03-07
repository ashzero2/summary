const axios = require("axios");

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "12cdf25c65754487b70db8abce0dea13",
  },
});

assembly
  .get(`/transcript/rn2odr77ne-35a3-4a3b-9472-3248839bb4cf`)
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));
