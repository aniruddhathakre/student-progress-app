const axios = require("axios");

const getContestHistory = async (handle) => {
  try {
    const url = `https://codeforces.com/api/user.rating?handle=${handle}`;

    const response = await axios.get(url);

    console.log("--- Raw response from Codeforces API ---");
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.status !== "OK") {
      throw new Error("Codeforces API returned an error");
    }
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching data for ${handle}`, error.message);

    throw new Error("Failed to fetch contest history from Codeforces.");
  }
};

module.exports = { getContestHistory };
