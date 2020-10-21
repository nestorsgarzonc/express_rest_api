const express = require('express')
const { verificaToken } = require('../middlewares/authentication')
let Producto = require('../models/product')

let app = express()

app.get('/productos', verificaToken, (req, res) => {
    let limit = Number.parseInt(req.body.limit) || 10
    let from = Number.parseInt(req.body.from) || 0
    Producto.find({})
        .sort()
        .skip(from)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            Producto.estimatedDocumentCount({ disponible: true }, (__, counter) => {
                return res.json({ ok: true, counter, product })
            })
        })
})

app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: err
                })
            }
            if (!product) {
                return res.status(400).json({ ok: false, product })
            }
            return res.json({ ok: true, product })
        })
})

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: err
                })
            }
            return res.json({ ok: true, product })
        })
})

app.post('/productos', verificaToken, (req, res) => {
    let body = req.body
    let product = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,
    })
    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            })
        }
        if (!productDB) {
            return res.status(400).json({ ok: false, productDB })
        }
        return res.status(201).json({ ok: true, productDB })
    })
})

app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = req.body
    Producto.findById(id, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (!productDB) {
            return res.status(500).json({ ok: false, productDB })
        }
        productDB.nombre = body.nombre
        productDB.precioUni = body.precioUni
        productDB.descripcion = body.descripcion
        productDB.disponible = body.disponible
        productDB.categoria = body.categoria
        productDB.save((err2, productSaved) => {
            if (err2) {
                return res.status(500).json({ ok: false, err })
            }
            return res.json({ ok: true, productSaved })
        })
    })
})

app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, deletedProduct) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            if (!deletedProduct) {
                return res.status(500).json({ ok: false, deletedProduct })
            }
            return res.json({ ok: true, deletedProduct })
        })
})

module.exports = app