const express = require('express')
let { verificaToken, verificaFreelancerRole } = require('../middlewares/authentication')

let app = express()

let Categoria = require('../models/category')

app.get('/categoria', verificaToken, (_, res) => {
    Categoria.find({})
        .sort()
        .populate('usuario', 'first_name email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            return res.json({ ok: true, categorias })
        })
})

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (!categoria) {
            return res.status(400).json({ ok: false, categoria })
        }
        return res.json({ ok: true, categoria })
    })
})

app.post('/categoria', [verificaToken, verificaFreelancerRole], (req, res) => {
    let body = req.body
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        return res.json({ ok: true, categoriaDB })
    })
})

app.put('/categoria/:id', [verificaToken, verificaFreelancerRole], (req, res) => {
    let id = req.params.id
    let body = req.body
    let descCategoria = {
        nombre: body.nombre
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        return res.json({ ok: true, categoriaDB })
    })
})

app.delete('/categoria/:id', [verificaToken, verificaFreelancerRole], (req, res) => {
    let id = req.params.id
    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'El id no existe'
            })
        }
        return res.json({ ok: true, categoriaDB })
    })
})

module.exports = app