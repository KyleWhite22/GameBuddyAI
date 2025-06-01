const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { gamesWithTags } = req.body;

    if (!Array.isArray(gamesWithTags)) {
      return res.status(400).json({ error: 'Invalid games format' });
    }

    // Example response without calling OpenAI
    const recommendations = `Based on your games: ${gamesWithTags.map(g => g.name).join(', ')}, you might like Hollow Knight or Dead Cells.`;

    res.json({ recommendations });
  } catch (err) {
    console.error('🔥 Recommendation error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
