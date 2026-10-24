const express = require('express');
const connectDB = require('../config/db');
const auth = require('../middleware/auth');
const errorHandler = require('../middleware/errorHandler');

const app = express();

app.set('json spaces', 2);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Pastikan database terhubung sebelum route /api diproses
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        next(err);
    }
});

// Daftarkan rute sesuai struktur server.js
app.use('/api/auth', require('../routes/auth'));
app.use('/api/notes', auth, require('../routes/notes'));
app.use('/api/stats', auth, require('../routes/stats'));

app.get('/api', (req, res) => {
    res.json({ status: 'API IksunSave Berjalan Normal!' });
});

app.use(errorHandler);

module.exports = app;