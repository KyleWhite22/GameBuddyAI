import React, { useState, useEffect } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [topGames, setTopGames] = useState([]);

  useEffect(() => {
    const topThree = JSON.parse(localStorage.getItem('topThree')) || [];
    setTopGames(topThree);
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gamesWithTags: topGames }),
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
    <div className="chatbot-container">
      <h1>AI Game Recommender</h1>

      <div className="top-games">
        {topGames.map((game) => (
          <div className="top-game-card" key={game.appid}>
            <img
              src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
              alt={game.name}
              onError={(e) => (e.target.style.display = 'none')}
            />
            <p>{game.name}</p>
          </div>
        ))}
      </div>

      <button onClick={fetchRecommendations} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>

      {recommendations && (
        <div className="recommendation-output">
          <p>Based on your top 3 most played games, we recommend:</p>
          <pre>{recommendations}</pre>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
