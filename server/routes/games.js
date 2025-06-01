const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/user/:steamId', async (req, res) => {
  const steamId = req.params.steamId;

  try {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&format=json`;

    const response = await axios.get(url);
    const games = response.data.response.games || [];

    const topThree = [...games]
      .sort((a, b) => b.playtime_forever - a.playtime_forever)
      .slice(0, 3)
      .map(g => ({
        name: g.name || g.appid.toString(),
        tags: [] // placeholder for Twitch tags
      }));

    res.json({ allGames: games, topThree });
  } catch (err) {
    console.error('🔥 Error fetching user games:', err.message);
    res.status(500).json({ error: 'Could not fetch user games' });
  }
});
// Simulate Twitch tags based on the game name
function mockTwitchTags(gameName) {
  if (gameName.toLowerCase().includes('hades')) return ['Roguelike', 'Action'];
  if (gameName.toLowerCase().includes('celeste')) return ['Platformer', 'Indie', 'Story-rich'];
  if (gameName.toLowerCase().includes('dota')) return ['MOBA', 'Competitive'];
  return ['Adventure', 'Singleplayer'];  // default
}

module.exports = router;
