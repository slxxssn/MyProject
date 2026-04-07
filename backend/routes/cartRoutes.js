// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// ------------------- ADD TO CART -------------------
router.post('/', (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    const sql = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';

    db.query(sql, [user_id, product_id, quantity], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error adding to cart' });
        }
        res.json({ message: 'Product added to cart' });
    });
});

// ------------------- GET USER CART -------------------
router.get('/:user_id', (req, res) => {
    const userId = req.params.user_id;

    const sql = `
        SELECT 
            cart.id, 
            cart.product_id,   -- ✅ VERY IMPORTANT (FIX)
            products.name, 
            products.price, 
            cart.quantity
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error fetching cart' });
        }
        res.json(results);
    });
});

// ------------------- REMOVE FROM CART -------------------
router.delete('/:id', (req, res) => {
    const cartId = req.params.id;

    const sql = 'DELETE FROM cart WHERE id = ?';

    db.query(sql, [cartId], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error removing item' });
        }
        res.json({ message: 'Item removed from cart' });
    });
});

// ------------------- CLEAR CART AFTER CHECKOUT -------------------
router.delete('/clear/:user_id', (req, res) => {
    const userId = req.params.user_id;

    const sql = 'DELETE FROM cart WHERE user_id = ?';

    db.query(sql, [userId], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to clear cart' });
        }
        res.json({ message: 'Cart cleared' });
    });
});

module.exports = router;