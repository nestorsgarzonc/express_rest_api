const express = require('express')
const fs = require('fs')
const path = require('path')
const { verificaTokenImg } = require('../middlewares/authentication')
let app = express()

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo
    let img = req.params.img

    let pathImage = path.join(__dirname, `../../uploads/${tipo}/${img}`)
    if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage)
    }
    let noImagePath = path.join(__dirname, '../assets/no-image.jpg')
    res.sendFile(noImagePath)
})

module.exports = app