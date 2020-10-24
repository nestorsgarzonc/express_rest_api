const express = require('express')
const Usuario = require('../models/user')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const app = express()

const { verificaToken } = require('../middlewares/authentication')

app.get('/usuario', (req, res) => {
    let desde = Number.parseInt(req.query.desde) || 0
    let limite = Number.parseInt(req.query.limite) || 5
    Usuario.find({ status: true }, /*'nombre email'*/)
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({ ok: false, err })
            }
            Usuario.estimatedDocumentCount({ status: true }, (__, counter) => {
                res.json({ ok: true, counter, usuarios })
            })
        })
})

app.post('/usuario', (req, res) => {
    let body = req.body
    let usuario = new Usuario({
        first_name: body.first_name,
        last_name: body.last_name,
        username: body.username,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        location: body.location,
        gender: body.gender,
        img: body.img,
        role: body.role,
        status: body.status
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

app.put('/usuario/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['first_name', 'last_name', 'email', 'img', 'role', 'status', 'location', 'gender', 'username'])
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else {
            res.json({
                ok: true,
                usuario: userDB
            })
        }
    })

})

app.delete('/usuario/:id', [verificaToken], (req, res) => {
    let id = req.params.id
    Usuario.findOneAndUpdate(id, { status: false }, { new: true }, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User not found'
                }
            })
        }
        res.json({
            ok: true,
            usuario: deletedUser
        })
    })
})

module.exports = app 