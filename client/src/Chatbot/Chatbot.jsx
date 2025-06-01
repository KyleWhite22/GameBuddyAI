import React, { useState } from 'react';

function Chatbot() {
  const [recommendations, setRecommendations] = useState('');
  const [gameTags, setGameTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTagsForTopGames = async (topGames) => {
    const tagPromises = topGames.map(async (game) => {
      const res = await fetch(`http://localhost:5000/api/steam/tags/${game.appid}`);
      const data = await res.json();
      return {
        name: game.name,
        appid: game.appid,
        tags: data.tags || []
      };
    });
    return Promise.all(tagPromises);
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const topThree = JSON.parse(localStorage.getItem('topThree')) || [];

      const gamesWithTags = await fetchTagsForTopGames(topThree);
      setGameTags(gamesWithTags); // ✅ save for display

      const res = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gamesWithTags }),
      });

      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setRecommendations('Failed to fetch recommendations.');
      console.error('❌ Error fetching recommendations:', err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>AI Game Recommender</h1>
      <button onClick={fetchRecommendations} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>

      {gameTags.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Top 3 Games and Their Tags:</h2>
          {gameTags.map((game) => (
            <div key={game.appid} style={{ marginBottom: '1rem' }}>
              <h3>{game.name}</h3>
              <p><strong>Tags:</strong></p>
              <ul>
                {game.tags.map((tag, i) => (
                  <li key={i}>{tag}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {recommendations && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Recommendations:</h2>
          <pre>{recommendations}</pre>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
