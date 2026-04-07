const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const sendEmail = require('../utils/sendEmail');
const upload = require('../middleware/upload'); // ✅ fixed multer

const otpStore = {};

// ------------------- SEND OTP -------------------
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  try {
    await sendEmail(email, 'Your Verification Code', `Your OTP is: ${otp}`);
    console.log(`OTP for ${email}: ${otp}`);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// ------------------- VERIFY OTP -------------------
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const storedOtp = otpStore[email];
  if (!storedOtp) return res.status(400).json({ message: 'No OTP found for this email' });
  if (parseInt(otp) !== storedOtp) return res.status(400).json({ message: 'Incorrect OTP' });

  delete otpStore[email];
  res.json({ message: 'OTP verified successfully' });
});

// ------------------- REGISTER -------------------
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, password, profile_image) VALUES (?, ?, ?, NULL)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.json({ message: 'User registered successfully', userId: result.insertId });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------- LOGIN -------------------
router.post('/login', (req, res) => {
  const { loginIdentifier, password } = req.body;
  if (!loginIdentifier || !password)
    return res.status(400).json({ message: 'Username/email and password are required' });

  const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(sql, [loginIdentifier, loginIdentifier], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    res.json({
      message: `Welcome back, ${user.username}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_image: user.profile_image, // filename
      },
    });
  });
});

// ------------------- GET USER BY ID -------------------
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, username, email, profile_image FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json(results[0]); // returns {id, username, email, profile_image}
  });
});

// ------------------- UPDATE PROFILE -------------------
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  const sql = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
  db.query(sql, [username, email, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update profile' });
    res.json({ message: 'Profile updated successfully' });
  });
});

// ------------------- UPLOAD PROFILE IMAGE -------------------
router.post('/upload-profile/:id', upload.single('avatar'), (req, res) => {
  const { id } = req.params;

  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const filename = req.file.filename; // save filename in DB
  const sql = 'UPDATE users SET profile_image = ? WHERE id = ?';
  db.query(sql, [filename, id], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to save image' });

    res.json({ message: 'Profile image uploaded successfully', profile_image: filename });
  });
});

module.exports = router;