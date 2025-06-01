import React, { useState } from 'react';

function Chatbot() {
  const [recommendations, setRecommendations] = useState('');
  const [error, setError] = useState('');

  const fetchRecommendations = async () => {
    try {
      const topThree = JSON.parse(localStorage.getItem('topThree')) || [];

      if (!Array.isArray(topThree) || topThree.length === 0) {
        setError('No top games found in local storage.');
        return;
      }

      const res = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gamesWithTags: topThree })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch recommendations');
      }

      const data = await res.json();
      setRecommendations(data.recommendations);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching recommendations:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>AI Game Recommender</h1>
      <button onClick={fetchRecommendations}>Get Recommendations</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <pre>{recommendations}</pre>
    </div>
  );
}

export default Chatbot;
