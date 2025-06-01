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
    const requestRef = useRef();

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

    function fetchGames(steamId) {
        fetch(`http://localhost:5000/api/games/user/${steamId}`)
            .then(res => res.json())
            .then(data => {
                setGames(data.response?.games?.slice(0, 20) || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch games:', err);
                setLoading(false);
            });
    }

    useEffect(() => {
        const animate = () => {
            setRotation(prev => (prev + .07) % 360);
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    if (loading) return <p>Loading profile...</p>;
    if (!user) return <p>You are not logged in with Steam.</p>;

    return (
        <div className="profile-container">
            <h1>Welcome, {user.displayName}</h1>
            <img
                className="avatar"
                src={user.photos[2]?.value || user.photos[0].value}
                alt="avatar"
            />
            <p>Steam ID: {user.id}</p>

            <div style={{ marginTop: '10rem' }}>
                <div className="carousel-container">
                    <div
                        className="carousel-inner"
                        style={{ transform: `rotateY(${rotation}deg)` }}
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
                                        transform: `rotateY(${angle}deg) translateZ(300px)`
                                    }}
                                    onMouseEnter={() => setShowGlow(true)}
                                    onMouseLeave={() => setShowGlow(false)}
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
            </div>

            {showGlow && <div className="cyber-glow-overlay" />}
            <button
                onClick={() => navigate('/chatbot')}
                style={{ marginTop: '2rem', padding: '0.5rem 1rem', fontSize: '1rem' }}
            >
                Chat with Game Recommender
            </button>

        </div>

    );
}

export default Profile;
