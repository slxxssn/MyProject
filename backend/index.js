const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

// ───── ADD THESE LINES AFTER "const db = require('./db');"
const session = require('express-session');           // session support
const passport = require('passport');                 // passport
require('./config/passport');                         // load passport config
const authRoutes = require('./routes/authRoutes');    // Google OAuth routes

const app = express();

// ✅ IMPORT EXISTING ROUTES
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ✅ MIDDLEWARE
app.use(cors({
    origin: 'http://localhost:3000', // React frontend
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional, for form data

// ───── SESSION + PASSPORT
app.use(
    session({
        secret: 'secretkey',
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// ✅ MAKE UPLOADS FOLDER PUBLIC
app.use('/uploads', express.static('uploads')); // <-- this is the step 5 fix

// ✅ CONNECT EXISTING ROUTES
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ───── GOOGLE AUTH ROUTES
app.use('/api/auth', authRoutes);

// ✅ TEST ROUTE
app.get('/', (req, res) => {
    res.send('Backend is running...');
});

// ✅ TEST DATABASE CONNECTION
app.get('/test-db', (req, res) => {
    db.query('SELECT 1', (err, result) => {
        if (err) {
            res.status(500).send('Database error');
        } else {
            res.send('Database connected successfully');
        }
    });
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});