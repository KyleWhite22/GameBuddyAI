require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const steamAuth = require('./auth/steam');
const gamesRoute = require('./routes/games'); // ✅ NEW
const steamTagsRoute = require('./routes/steamTags');
const recommendRoute = require('./routes/recommend');

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use('/auth', steamAuth);
app.use('/api/games', gamesRoute); // ✅ NEW
app.use('/api', steamTagsRoute);
app.use('/api/recommend', recommendRoute);  // New recommendation route


app.listen(5000, () => {
  console.log('✅ Server listening on http://localhost:5000');
});
