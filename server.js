require('dotenv').config();
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET belum diisi di .env');
}

const app = express();
const PORT = process.env.PORT || 3000;

app.set('json spaces', 2);
app.use(express.json({ limit: '1mb' }));

// pastikan database terhubung sebelum route /api diproses
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        next(err);
    }
});

// batasi percobaan login (anti brute force)
app.use('/api/auth/login', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { sukses: false, pesan: 'Terlalu banyak percobaan, coba lagi nanti' }
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', auth, require('./routes/notes'));
app.use('/api/stats', auth, require('./routes/stats'));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.redirect('/login.html'));

app.use(errorHandler);

// jalan lokal: node server.js | di Vercel: app hanya di-export
if (require.main === module) {
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server jalan di http://127.0.0.1:${PORT}`);
            });
        })
        .catch((err) => {
            console.error('Gagal konek MongoDB:', err.message);
            process.exit(1);
        });
}

module.exports = app;