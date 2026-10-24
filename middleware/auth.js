const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ sukses: false, pesan: 'Token tidak ada' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, nama }
        next();
    } catch {
        res.status(401).json({ sukses: false, pesan: 'Token tidak valid atau sudah kedaluwarsa' });
    }
};