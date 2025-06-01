// src/Chatbot/Chatbot.jsx
import React, { useState } from 'react';

function Chatbot() {
  const [recommendations, setRecommendations] = useState('');

  const fetchRecommendations = async () => {
    const res = await fetch('http://localhost:5000/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        games: [
          { name: 'Mass Effect' },
          { name: 'Elden Ring' }
        ]
      })
    });

    const data = await res.json();
    setRecommendations(data.recommendations);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>AI Game Recommender</h1>
      <button onClick={fetchRecommendations}>Get Recommendations</button>
      <pre>{recommendations}</pre>
    </div>
  );
}

export default Chatbot;

