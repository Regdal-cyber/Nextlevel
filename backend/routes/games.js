const pool = require('../db');
const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /games — получить все игры
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM games ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /games/:id — получить игру по ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Игра не найдена' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /games — добавить игру
router.post('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { title, description, genre, platform, price, rating, cover, release_date, popular, in_stock } = req.body;

        if (!title || !price) {
            return res.status(400).json({ error: 'Название и цена обязательны' });
        }

        const result = await pool.query(
            `INSERT INTO games (title, description, genre, platform, price, rating, cover, release_date, popular, in_stock)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [title, description, genre, platform, price, rating, cover, release_date, popular, in_stock]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /games/:id — обновить игру
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, genre, platform, price, rating, cover, release_date, popular, in_stock } = req.body;

        const result = await pool.query(
            `UPDATE games SET 
                title = $1, description = $2, genre = $3, platform = $4,
                price = $5, rating = $6, cover = $7, release_date = $8,
                popular = $9, in_stock = $10
             WHERE id = $11 RETURNING *`,
            [title, description, genre, platform, price, rating, cover, release_date, popular, in_stock, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Игра не найдена' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /games/:id — удалить игру
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM games WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Игра не найдена' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;