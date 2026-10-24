const mongoose = require('mongoose');

let promise = null;

module.exports = function connectDB() {
    if (mongoose.connection.readyState === 1) return Promise.resolve();

    if (!promise) {
        promise = mongoose.connect(process.env.MONGO_URI)
            .then(() => console.log('Terhubung ke MongoDB'))
            .catch((err) => { promise = null; throw err; });
    }
    return promise;
};