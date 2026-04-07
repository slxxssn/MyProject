const express = require('express');
const router = express.Router();
const db = require('../db');

// ------------------- CREATE ORDER (used ONLY by Cart.js checkout) -------------------
router.post('/', (req, res) => {
    const { user_id, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Insert into orders table
    const orderSql = 'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)';
    db.query(orderSql, [user_id, total, 'pending'], (err, orderResult) => {
        if (err) return res.status(500).json({ message: 'Error creating order' });

        const orderId = orderResult.insertId;

        // Insert each item into order_items
        const itemsSql = `
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES ?
        `;

        const values = items.map(item => [
            orderId,
            item.product_id,
            item.quantity,
            item.price
        ]);

        db.query(itemsSql, [values], (err) => {
            if (err) return res.status(500).json({ message: 'Error saving order items' });

            // Optionally, clear cart here if desired
            db.query('DELETE FROM cart WHERE user_id = ?', [user_id]);

            res.json({ message: 'Order placed successfully' });
        });
    });
});

// ------------------- GET ORDERS FOR USER -------------------
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT o.id as order_id, o.total, o.status, o.created_at,
               oi.product_id, oi.quantity, oi.price, p.name as product_name
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching orders' });

        // Transform results into array of orders with items
        const ordersMap = {};

        results.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    id: row.order_id,
                    total: row.total,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                };
            }

            ordersMap[row.order_id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                price: row.price
            });
        });

        const ordersArray = Object.values(ordersMap);
        res.json(ordersArray);
    });
});

// ------------------- DELETE INDIVIDUAL ORDER -------------------
router.delete('/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    // Delete order items first
    db.query('DELETE FROM order_items WHERE order_id = ?', [orderId], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting order items' });

        // Delete order itself
        db.query('DELETE FROM orders WHERE id = ?', [orderId], (err) => {
            if (err) return res.status(500).json({ message: 'Error deleting order' });

            res.json({ message: 'Order deleted successfully' });
        });
    });
});

module.exports = router;