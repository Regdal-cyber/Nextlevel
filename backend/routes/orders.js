const pool = require('../db');
const express = require('express');
const router = express.Router();

// GET /orders — получить все заказы
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, 
                   json_agg(json_build_object(
                       'id', oi.id,
                       'game_id', oi.game_id,
                       'quantity', oi.quantity,
                       'price', oi.price
                   )) AS items
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /orders/:id — получить заказ по ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT o.*, 
                   json_agg(json_build_object(
                       'id', oi.id,
                       'game_id', oi.game_id,
                       'quantity', oi.quantity,
                       'price', oi.price
                   )) AS items
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE o.id = $1
            GROUP BY o.id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заказ не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /orders — создать заказ
router.post('/', async (req, res) => {
    const client = await pool.connect();

    try {
        const { customer_name, customer_email, items } = req.body;

        // Валидация
        if (!customer_name || !customer_email) {
            return res.status(400).json({ error: 'Имя и email обязательны' });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Корзина пуста' });
        }

        // Начинаем транзакцию
        await client.query('BEGIN');

        // Считаем итоговую сумму
        let total = 0;
        for (const item of items) {
            const gameResult = await client.query('SELECT price FROM games WHERE id = $1', [item.game_id]);
            if (gameResult.rows.length === 0) {
                throw new Error(`Игра с ID ${item.game_id} не найдена`);
            }
            total += Number(gameResult.rows[0].price) * item.quantity;
        }

        // Создаём заказ
        const orderResult = await client.query(
            `INSERT INTO orders (customer_name, customer_email, total)
             VALUES ($1, $2, $3) RETURNING *`,
            [customer_name, customer_email, total]
        );

        const order = orderResult.rows[0];

        // Добавляем товары в заказ
        for (const item of items) {
            const gameResult = await client.query('SELECT price FROM games WHERE id = $1', [item.game_id]);
            const price = gameResult.rows[0].price;

            await client.query(
                `INSERT INTO order_items (order_id, game_id, quantity, price)
                 VALUES ($1, $2, $3, $4)`,
                [order.id, item.game_id, item.quantity, price]
            );
        }

        // Завершаем транзакцию
        await client.query('COMMIT');

        res.status(201).json(order);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
});

// PUT /orders/:id — обновить статус заказа
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'processing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Некорректный статус' });
        }

        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заказ не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;