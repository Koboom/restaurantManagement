const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const logger = require("./config/logger")
const crypto = require("crypto")
const session = require("express-session");

const indexRouter = require("./routes/index")

require("./mongo-connection")
const { initializeSocket } = require("./socket-connection");
require("dotenv").config()

const app = express()

app.set("view engine", "pug")

//Oturum anahtarı oluşturma ve sunucu oluşturma
const server = require("http").createServer(app)
initializeSocket(server)
const secretKey = crypto.randomBytes(32).toString('hex');
logger.info("Secret key oluşturuldu:", secretKey);
console.log("Secret key:", secretKey);

// Middleware'leri kullanma
app.use(bodyParser.json({ limit: "10mb"}));// JSON veri alışverişi yapabilmek için limit değişkeni 10mb olarak ayarlandı.
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // URL kodlamasını çözmek için limit değişkeni 10mb olarak ayarlandı.

// CORS middleware
app.use(cors({
    origin: ['http://localhost:8080'], // Canlı ve geliştirme domainlerini ekleyin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH',"OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'], // Gerekli başlıkları ekle
    credentials: true
  }));

app.use(express.json());
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', sameSite: "none" }
}));

// Rotalar
app.use("/", indexRouter)

// Hata yakalama
app.use((err, req, res, next) => {
    logger.error(`Fehler aufgetreten: ${err.message}`); // Hata mesajını log dosyasına yazdırma
    console.log(err.stack);
    res.status(500).send('Etwas ist schief gelaufen!');
});

logger.info('Uygulama çalışıyor...');
logger.warn('Bu bir uyarı mesajı.');
logger.error('Bu bir hata mesajı.');

module.exports = { app, server };
