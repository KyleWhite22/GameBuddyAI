import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rotation, setRotation] = useState(0);
    const [showGlow, setShowGlow] = useState(false);
    const [topGames, setTopGames] = useState([]);
    const [recommendations, setRecommendations] = useState('');
    const requestRef = useRef();

    useEffect(() => {
        const topThree = JSON.parse(localStorage.getItem('topThree')) || [];
        setTopGames(topThree);
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/auth/user', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                    fetchGames(data.user.id);
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error('Failed to fetch user:', err);
                setLoading(false);
            });
    }, []);
    useEffect(() => {
        const topThree = JSON.parse(localStorage.getItem('topThree')) || [];
        setTopGames(topThree);
    }, []);

    function fetchGames(steamId) {
        fetch(`http://localhost:5000/api/games/user/${steamId}`)
            .then(res => res.json())
            .then(data => {
                setGames(data.allGames || []);
                localStorage.setItem('topThree', JSON.stringify(data.topThree));
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch games:', err);
                setLoading(false);
            });
    }

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

    useEffect(() => {
        const animate = () => {
            setRotation(prev => (prev + .07) % 360);
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

   // if (loading) return <p>Loading profile...</p>;
    if (!user) return <p>You are not logged in with Steam.</p>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    className="avatar"
                    src={user.photos[2]?.value || user.photos[0].value}
                    alt="avatar"
                />
                <h1 className="username">{user.displayName}</h1>
            </div>

            <p>Your Steam Games:</p>

            <div className="carousel-container">

                <div
                    className="carousel-inner"
                    style={{ "--rotation": `${rotation}deg` }}
                >
                    {games.map((game, index) => {
                        const angle = (360 / games.length) * index;
                        const totalAngle = (angle + rotation) % 360;
                        const rad = (totalAngle * Math.PI) / 180;
                        const isVisible = Math.cos(rad) > 0.5;

                        const iconUrl = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;

                        return (
                            <div
                                key={game.appid}
                                className={`game-card ${isVisible ? 'visible' : ''}`}
                                style={{
                                    transform: `rotateY(${angle}deg) translateZ(400px)`
                                }}
                            >
                                <img
                                    src={iconUrl}
                                    alt={game.name}
                                    onError={(e) => (e.target.style.display = 'none')}
                                />
                                <div className="game-info">
                                    <p>{game.name}</p>
                                    <p>{Math.round(game.playtime_forever / 60)} hrs</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="neon-divider" />

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

            <div className="chatbot-container">
                <h1>AI Game Recommender</h1>
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
        </div>
    );
}

export default Profile;
