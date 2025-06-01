const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/tags/:appid', async (req, res) => {
  const { appid } = req.params;
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
    const response = await axios.get(url);
    const gameData = response.data[appid];

    if (gameData.success && gameData.data) {
      const categories = gameData.data.categories?.map(c => c.description) || [];
      const genres = gameData.data.genres?.map(g => g.description) || [];
      const tags = [...new Set([...categories, ...genres])]; // unique tags
      return res.json({ tags });
    } else {
      return res.json({ tags: [] });
    }
  } catch (err) {
    console.error(`🔥 Error fetching tags for appid ${appid}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch Steam tags' });
  }
});

module.exports = router;
