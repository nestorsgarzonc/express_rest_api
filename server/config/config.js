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