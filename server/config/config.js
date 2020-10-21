//======================
//Port
//======================

process.env.PORT = process.env.PORT || 3000

//======================
//Entorno
//======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//======================
//Vencimiento token
//======================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//======================
//Seed autenticacion
//======================
process.env.SEED = process.env.SEED || 'dev_secret_seed'

//======================
//DB
//======================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/waffly'
} else {
    urlDB = process.env.MONGO_URI
}
process.env.URLDB = urlDB;

//======================
//Google Client id
//======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '912287174654-2u6bpq94gk47kaj165hmrdm3crqvgj1h.apps.googleusercontent.com'
