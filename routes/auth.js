const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/login', asyncHandler(async (req, res) => {
    const { nama, password, remember } = req.body || {};

    if (typeof nama !== 'string' || typeof password !== 'string' || !nama || !password) {
        return res.status(400).json({
            sukses: false,
            pesan: 'nama dan password wajib diisi'
        });
    }

    const user = await User.findOne({ nama });
    const cocok = user ? await bcrypt.compare(password, user.password) : false;

    // pesan sengaja disamakan supaya orang tidak bisa menebak username yang ada
    if (!cocok) {
        return res.status(401).json({
            sukses: false,
            pesan: 'Username atau password salah'
        });
    }

    const token = jwt.sign(
        { id: user._id, nama: user.nama },
        process.env.JWT_SECRET,
        { expiresIn: remember ? '7d' : '1h' }
    );

    res.status(200).json({
        sukses: true,
        pesan: 'login berhasil',
        data: { id: user._id, nama: user.nama },
        token
    });
}));

module.exports = router;