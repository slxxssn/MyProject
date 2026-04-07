const express = require('express');
const router = express.Router();
const db = require('../db');

// ------------------- SEARCH PRODUCTS BY NAME -------------------
// MUST BE BEFORE /:id
router.get('/search', (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Query parameter q is required' });
    }

    const sql = `
        SELECT * FROM products 
        WHERE name LIKE ? 
        OR description LIKE ? 
        OR category LIKE ?
    `;

    const searchTerm = `%${q}%`;

    db.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error searching products' });
        }
        res.json(results);
    });
});

// ------------------- GET ALL PRODUCTS (optional category, featured, trending filter) -------------------
router.get('/', (req, res) => {
    const category = req.query.category;
    const featured = req.query.featured;
    const trending = req.query.trending;

    let sql = 'SELECT * FROM products';
    const params = [];

    if (category) {
        sql += ' WHERE category = ?';
        params.push(category);
    } else if (featured) {
        sql += ' WHERE is_featured = ?';
        params.push(1);
    } else if (trending) {
        sql += ' WHERE trending = ?';
        params.push(1);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error fetching products' });
        }
        res.json(results);
    });
});

// ------------------- GET TRENDING PRODUCTS (FOR HOMEPAGE) -------------------
router.get('/trending/all', (req, res) => {
    const sql = 'SELECT * FROM products WHERE trending = 1';

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error fetching trending products' });
        }
        res.json(results);
    });
});

// ------------------- LEGACY FEATURED PRODUCTS ROUTE -------------------
router.get('/featured/all', (req, res) => {
    const sql = 'SELECT * FROM products WHERE is_featured = 1';

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error fetching featured products' });
        }
        res.json(results);
    });
});

// ------------------- GET SINGLE PRODUCT BY ID -------------------
// MUST BE LAST
router.get('/:id', (req, res) => {
    const productId = req.params.id;

    const sql = 'SELECT * FROM products WHERE id = ?';

    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error fetching product' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = result[0];

        // Parse details JSON if exists
        try {
            if (product.details) {
                product.details = JSON.parse(product.details);
            } else {
                product.details = {};
            }
        } catch (e) {
            console.error('Failed to parse product details JSON:', e);
            product.details = {};
        }

        res.json(product);
    });
});

// ------------------- ADD NEW PRODUCT -------------------
// Example route for admin panel usage later
router.post('/', (req, res) => {
    const { name, description, price, category, image_url, is_featured, trending, details } = req.body;

    const sql = 'INSERT INTO products (name, description, price, category, image_url, is_featured, trending, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(
        sql,
        [name, description, price, category, image_url, is_featured || 0, trending || 0, JSON.stringify(details || {})],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error adding product' });
            }
            res.json({ message: 'Product added successfully', productId: result.insertId });
        }
    );
});

// ------------------- UPDATE PRODUCT -------------------
// Example route for admin panel usage later
router.put('/:id', (req, res) => {
    const productId = req.params.id;
    const { name, description, price, category, image_url, is_featured, trending, details } = req.body;

    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ?, is_featured = ?, trending = ?, details = ? WHERE id = ?';

    db.query(
        sql,
        [name, description, price, category, image_url, is_featured || 0, trending || 0, JSON.stringify(details || {}), productId],
        (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error updating product' });
            }
            res.json({ message: 'Product updated successfully' });
        }
    );
});

module.exports = router;