const express = require('express')
const Usuario = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { lastIndexOf } = require('underscore')
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

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


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let gToken = req.body.idtoken
    let googleUser = await verify(gToken)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err })
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({ ok: false, err: { message: 'Debe usar su autenticacion normal' } })
            } else {
                let token = jwt.sign(
                    { usuario: usuarioDB },
                    process.env.SEED,
                    { expiresIn: process.env.CADUCIDAD_TOKEN }
                )
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {
            let usuario = new Usuario()
            usuario.nombre = googleUser.name
            usuario.email = googleUser.email
            usuario.img = googleUser.picture
            usuario.google = true
            usuario.password = ':)'
            usuario.save((errU, usuarioDBU) => {
                if (errU) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                let token = jwt.sign(
                    { usuario: usuarioDBU },
                    process.env.SEED,
                    { expiresIn: process.env.CADUCIDAD_TOKEN }
                )
                return res.json({
                    ok: true,
                    usuario: usuarioDBU,
                    token
                })
            })
        }
    }) 
    res.json({ usuario: googleUser })
})

module.exports = app