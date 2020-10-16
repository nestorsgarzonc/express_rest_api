require('./config/config')
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/user'))

mongoose.connect('mongodb://127.0.0.1:27017/waffly', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => { if (err) { console.log(err); } else { console.log('Connected to mongo'); } });

app.get('/', function (_, res) {
    res.json('Hello World')
})

app.listen(process.env.PORT, () => console.log(`Listening at port ${process.env.PORT}`))
