import React from 'react';
import './Home.css';

function Home() {
 return (
        <div className="home-container">
                <h1>GameTracker AI</h1>
            <p>Your personal video game journal and AI assistant.</p>
                <a href="http://localhost:5000/auth/steam">
        <button className="steam-login-btn">Log in with Steam</button>
      </a>
        </div>
    );
        
}

export default Home;