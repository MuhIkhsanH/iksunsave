// bungkus handler async supaya error otomatis masuk ke errorHandler
module.exports = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);