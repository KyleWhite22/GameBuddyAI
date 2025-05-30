const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const router = express.Router();

// GET /api/games/user/:steamId
router.get('/user/:steamId', async (req, res) => {
  const steamId = req.params.steamId;
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Steam games:', error);
    res.status(500).json({ error: 'Failed to fetch games from Steam' });
  }
});

module.exports = router;