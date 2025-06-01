const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/user/:steamId', async (req, res) => {
  try {
    const steamId = req.params.steamId;
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&format=json`;

    const response = await axios.get(url);
    const games = response.data.response.games || [];

    const topThree = [...games]
      .sort((a, b) => b.playtime_forever - a.playtime_forever)
      .slice(0, 3)
      .map(game => ({ name: game.name }));

    res.json({
      allGames: games,
      topThree
    });
  } catch (err) {
    console.error('🔥 Error fetching games:', err.message);
    res.status(500).json({ error: 'Could not fetch games' });
  }
});

module.exports = router;

