const router = require('express').Router();
const sanitizeHtml = require('sanitize-html');
const Artikel = require('../models/Artikel');
const asyncHandler = require('../middleware/asyncHandler');

const bersihkan = (html) => sanitizeHtml(html || '', {
    allowedTags: ['b', 'strong', 'i', 'em', 'u', 's', 'strike', 'h1', 'h2',
                  'ul', 'ol', 'li', 'p', 'br', 'div', 'span'],
    allowedAttributes: {}
});

// daftar catatan (tanpa isi) + ukuran tiap dokumen, bisa dicari lewat ?q=
router.get('/', asyncHandler(async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';

    const filter = {};
    if (q) {
        // escape karakter spesial supaya input dianggap teks biasa
        const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [{ Judul: rx }, { Isi: rx }];
    }

    const data = await Artikel.aggregate([
        { $match: filter },
        { $project: { Judul: 1, Date: 1, size: { $bsonSize: '$$ROOT' } } },
        { $sort: { Date: -1 } }
    ]);
    res.json({ sukses: true, data });
}));

// satu catatan lengkap
router.get('/:id', asyncHandler(async (req, res) => {
    const data = await Artikel.findById(req.params.id);
    if (!data) {
        return res.status(404).json({ sukses: false, pesan: 'Catatan tidak ditemukan' });
    }
    res.json({ sukses: true, data });
}));

// buat catatan
router.post('/', asyncHandler(async (req, res) => {
    const { Judul, Isi } = req.body || {};

    const baru = await Artikel.create({
        Judul: (typeof Judul === 'string' && Judul.trim()) || 'Tanpa Judul',
        Isi: bersihkan(Isi)
    });

    res.status(201).json({ sukses: true, pesan: 'Catatan dibuat', data: baru });
}));

// update catatan
router.put('/:id', asyncHandler(async (req, res) => {
    const { Judul, Isi } = req.body || {};
    const update = { Date: Date.now() };

    if (typeof Judul === 'string') update.Judul = Judul.trim() || 'Tanpa Judul';
    if (typeof Isi === 'string') update.Isi = bersihkan(Isi);

    const data = await Artikel.findByIdAndUpdate(
        req.params.id,
        update,
        { returnDocument: 'after', runValidators: true }
    );

    if (!data) {
        return res.status(404).json({ sukses: false, pesan: 'Catatan tidak ditemukan' });
    }
    res.json({ sukses: true, pesan: 'Catatan diupdate', data });
}));

// hapus catatan
router.delete('/:id', asyncHandler(async (req, res) => {
    const data = await Artikel.findByIdAndDelete(req.params.id);

    if (!data) {
        return res.status(404).json({ sukses: false, pesan: 'Catatan tidak ditemukan' });
    }
    res.json({ sukses: true, pesan: 'Catatan dihapus' });
}));

module.exports = router;