//======================
//Port
//======================

process.env.PORT = process.env.PORT || 3000

//======================
//Entorno
//======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//======================
//DB
//======================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/waffly'
} else {
    urlDB = 'mongodb+srv://admin-nw:Sebastian1@cluster0.txwjd.mongodb.net/waffly'
}
process.env.URLDB = urlDB;