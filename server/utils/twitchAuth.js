const axios = require('axios');

async function getTwitchAccessToken() {
  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  });
  return response.data.access_token;
}

module.exports = getTwitchAccessToken;