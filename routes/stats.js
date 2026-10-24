const router = require('express').Router();
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');

const BATAS_MB = 512; // Free Tier

router.get('/', asyncHandler(async (req, res) => {
    const stats = await mongoose.connection.db.stats();
    const MB = 1024 * 1024;

    res.json({
        sukses: true,
        data: {
            database: stats.db,
            koleksi: stats.collections,
            dokumen: stats.objects,
            
            dataSizeMB: stats.dataSize / MB,
            storageSizeMB: stats.storageSize / MB,
            batasMB: BATAS_MB,
            persen: +((stats.dataSize / (BATAS_MB * MB)) * 100).toFixed(4)
        }
    });
}));

module.exports = router;