const express = require('express');
const passport = require('passport');
const router = express.Router();

// ✅ Start Google OAuth login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ✅ Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    // req.user now contains the DB user object: {id, username, email, googleId, ...}
    const user = req.user;

    // Redirect to frontend success page with all info
    res.redirect(
      `${process.env.FRONTEND_URL}/google-success?userId=${user.id}&name=${encodeURIComponent(user.username)}&email=${encodeURIComponent(user.email)}`
    );
  }
);

module.exports = router;