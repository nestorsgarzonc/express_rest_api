const express = require('express')
const Usuario = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { lastIndexOf } = require('underscore')

const app = express()

app.post('/login', (req, res) => {
    let body = req.body
    Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err: err })
        } else if (!userDB) {
            return res.status(400).json({ ok: false, err: { message: 'Usuario o contraseña incorrecta' } })
        } else if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({ ok: false, err: { message: 'Usuario o contraseña incorrecta' } })
        }
        let token = jwt.sign({ usuario: userDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
        res.json({ ok: true, user: userDB, token })
    })

})

module.exports = app