const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db'); // your MySQL connection

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.PORT ? 'http://localhost:' + process.env.PORT : ''}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const username = profile.displayName; // ✅ changed from name → username
        const googleId = profile.id;

        // Check if user exists in DB
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
          if (err) return done(err, null);

          if (results.length > 0) {
            // User exists, return it
            return done(null, results[0]);
          } else {
            // Insert new user
            const newUser = { username, email, password: null, googleId };
            db.query(
              'INSERT INTO users (username, email, password, googleId) VALUES (?, ?, ?, ?)',
              [username, email, null, googleId],
              (err, result) => {
                if (err) return done(err, null);
                newUser.id = result.insertId;
                return done(null, newUser);
              }
            );
          }
        });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  db.query('SELECT id, username, email FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return done(err, null);
    done(null, results[0]);
  });
});

module.exports = passport;