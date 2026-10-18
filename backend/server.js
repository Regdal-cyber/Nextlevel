const express = require('express');
const cors = require('cors');
require('dotenv').config();

const gamesRouter = require('./routes/games');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/games', gamesRouter);
app.use('/orders', ordersRouter);

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});