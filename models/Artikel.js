const mongoose = require('mongoose');

const artikelSchema = new mongoose.Schema({
    Judul: { type: String, default: 'Tanpa Judul', trim: true },
    Isi: { type: String, default: '' },
    Date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Artikel', artikelSchema, 'express');