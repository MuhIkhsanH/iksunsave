module.exports = (err, req, res, next) => {
    console.error('Terjadi eror:', err);

    if (err.name === 'CastError') {
        return res.status(400).json({ sukses: false, pesan: 'ID tidak valid' });
    }
    res.status(500).json({ sukses: false, pesan: 'Terjadi eror di server' });
};