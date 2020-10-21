require('./config/config')
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, '../public/')))

app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => { if (err) { console.log(err); } else { console.log('Connected to mongo'); } });

app.get('/', function (_, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.listen(process.env.PORT, () => console.log(`Listening at port ${process.env.PORT}`))
