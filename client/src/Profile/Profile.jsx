import React, { useEffect, useState } from 'react';

function Profile() {
    const [user, setUser] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Step 1: Get logged-in Steam user info from your backend
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
                setGames(data.response?.games || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch games:', err);
                setLoading(false);
            });
    }

    if (loading) return <p>Loading profile...</p>;

    if (!user) return <p>You are not logged in with Steam.</p>;

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial', color: '#00ff00', backgroundColor: '#000', minHeight: '100vh' }}>
            <h1>Welcome, {user.displayName}</h1>
            <img src={user.photos[2]?.value || user.photos[0].value} alt="avatar" style={{ borderRadius: '50%', width: '100px' }} />
            <p>Steam ID: {user.id}</p>

            <h2>Owned Games</h2>
            {games.length === 0 ? (
                <p>No games found on your Steam account.</p>
            ) : (
                <ul>
                    {games.map((game) => (
                        <li key={game.appid}>
                            {game.name} – {Math.round(game.playtime_forever / 60)} hrs
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Profile;