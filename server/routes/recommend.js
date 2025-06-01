const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { games } = req.body;

    if (!games || !Array.isArray(games)) {
      return res.status(400).json({ error: 'Invalid games format' });
    }

    // Simulated response
    const recommended = games.map(game => `If you liked ${game.name}, try something similar!`);
    res.json({ recommendations: recommended.join('\n') });

  } catch (err) {
    console.error('🔥 Recommendation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
