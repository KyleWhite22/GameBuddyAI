const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { gamesWithTags } = req.body;

    if (!Array.isArray(gamesWithTags)) {
      return res.status(400).json({ error: 'Invalid games format' });
    }

    // ✅ Extract and flatten all tags
    const allTags = gamesWithTags.flatMap(game => game.tags || []);
    const uniqueTags = [...new Set(allTags)];

    // ✅ Create a fake recommendation using the tags
    const recommendations = `Because you enjoy games with tags like: ${uniqueTags.join(', ')}, you might like Hades, Hollow Knight, or Slay the Spire.`;

    res.json({ recommendations });
  } catch (err) {
    console.error('🔥 Recommendation error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
