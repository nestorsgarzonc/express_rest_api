const express = require('express')
const Usuario = require('../models/user')
const bcrypt = require('bcrypt')
const app = express()

app.get('/usuario', function (req, res) {
    res.json('Hello W')
})

app.post('/usuario', function (req, res) {
    let body = req.body
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({ ok: true, persona: usuarioDB })
    })
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
})

app.delete('/usuario', function (req, res) {
    res.json('Delete Hello')
})

module.exports = app 