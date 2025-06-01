const express = require('express');
const axios = require('axios');
const getTwitchAccessToken = require('../utils/twitchAuth');

const router = express.Router();

router.get('/tags/:gameName', async (req, res) => {
  try {
    const token = await getTwitchAccessToken();
    const { gameName } = req.params;

    // Step 1: Get game ID by name
    const gameRes = await axios.get('https://api.twitch.tv/helix/games', {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`
      },
      params: { name: gameName }
    });

    const gameId = gameRes.data.data[0]?.id;
    if (!gameId) return res.status(404).send('Game not found');

    // Step 2: Get tags for streams of that game
    const streamsRes = await axios.get('https://api.twitch.tv/helix/streams', {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`
      },
      params: { game_id: gameId }
    });

    const tags = streamsRes.data.data.flatMap(stream => stream.tag_ids || []);
    res.json({ gameName, tags });
  } catch (err) {
    console.error('Failed to fetch Twitch tags:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
