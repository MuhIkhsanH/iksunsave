const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('../config/db');

const authRoutes = require('../routes/auth');
const notesRoutes = require('../routes/notes');
const statsRoutes = require('../routes/stats');

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api', (req, res) => {
    res.json({ status: 'API IksunSave Berjalan Normal!' });
});

module.exports = app;