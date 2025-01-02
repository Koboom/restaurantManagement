// logger.js
//Winston, uygulamanın hata yönetimini güçlendirmek için
// Takip etmek için "winston.createLogger" ile error.log ve combined.log dosyalarını oluşturuyorum.
// Hata detaylarını bu iki dosyada saklayarak, uygulamanın hata yönetimini takip ediyorum.
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console() // Konsol çıktısı için
  ],
});

module.exports = logger;
