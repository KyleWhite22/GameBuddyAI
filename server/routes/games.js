const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const router = express.Router();
router.get('/test', (req, res) => {
    res.send('/api/games/test is working!');
});
router.get('/user/:steamId', async (req, res) => {
    const steamId = req.params.steamId;

    if (!steamId) {
        return res.status(400).json({ error: 'Missing Steam ID' });
    }

    const apiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('Steam API Response:', JSON.stringify(data, null, 2));
        res.json(data);
    } catch (err) {
        console.error('Error fetching games from Steam:', err);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

module.exports = router;