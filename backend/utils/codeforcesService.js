const axios = require("axios");
const crypto = require("crypto");

const makeApiRequest = async (methodName, params) => {
  const key = process.env.CODEFORCES_API_KEY;
  const secret = process.env.CODEFORCES_API_SECRET;

  if (!key || !secret) {
    throw new Error("Codeforces API key or secret not found in .env file");
  }

  params.apiKey = key;
  params.time = Math.floor(Date.now() / 1000);

  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const rand = Math.random().toString(36).substring(2, 8);
  const signatureString = `${rand}/${methodName}?${sortedParams}#${secret}`;
  const apiSig = crypto
    .createHash("sha512")
    .update(signatureString, "utf-8")
    .digest("hex");
  const finalUrl = `https://codeforces.com/api/${methodName}?${sortedParams}&apiSig=${rand}${apiSig}`;

  try {
    const response = await axios.get(finalUrl);

    if (response.data.status !== "OK")
      throw new Error(
        `Codeforces API returned status: ${response.data.comment}`
      );
    return response.data.result;
  } catch (error) {
    console.error(
      `Error during Codeforces API call to ${methodName}:`,
      error.response ? error.response.data : error.message
    );
    throw new Error(`Failed to call Codeforces method: ${methodName}`);
  }
};

const getContestHistory = (handle) => {
  return makeApiRequest("user.rating", { handle });
};

const getSubmissionHistory = (handle) => {
  return makeApiRequest("user.status", { handle });
};

module.exports = { getContestHistory, getSubmissionHistory };
