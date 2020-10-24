const express = require('express')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const path = require('path')

const app = express()

const Usuario = require('../models/user')
const Producto = require('../models/service')

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files) {
        return res.status(400).json({ ok: false, err: { message: 'No se ha seleccionado ningun archivo' } })
    }
    let tiposValidos = ['servicios', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: { message: `Las tipos validos son: ${tiposValidos}` }
        })
    }

    let archivo = req.files.image
    let nombreArchivoCortado = archivo.name.split('.')
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1]
    let extensionesValidas = ['png', 'jpg', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            ext: extension,
            err: { message: `Las extensiones validas son: ${extensionesValidas}` }
        })
    }

    //Cambiar nombre archivo
    let nombreArchivo = `${id}__${new Date().getMilliseconds()}.${extension}`
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) return res.status(500).json({ ok: false, message: err })
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo)
        } else {
            imagenProducto(id, res, nombreArchivo)
        }
    })
})

const imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            deleteFile(usuarioDB.img, 'usuarios')
            return res.status(500).json({ ok: false, err })
        }
        if (!usuarioDB) {
            deleteFile(nombreArchivo, 'usuarios')
            return res.status(400).json({ ok: false, err: { message: 'Usuario no encontrado' } })
        }
        deleteFile(usuarioDB.img, 'usuarios')
        usuarioDB.img = nombreArchivo
        usuarioDB.save((_, usuarioGuardado) => {
            res.json({ ok: true, usuario: usuarioGuardado, img: nombreArchivo })
        })
    })
}
const imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            deleteFile(productoDB.img, 'productos')
            return res.status(500).json({ ok: false, err })
        }
        if (!productoDB) {
            deleteFile(nombreArchivo, 'productos')
            return res.status(400).json({ ok: false, err: { message: 'Producto no encontrado' } })
        }
        deleteFile(productoDB.img, 'productos')
        productoDB.img = nombreArchivo
        productoDB.save((_, productSaved) => {
            res.json({ ok: true, producto: productSaved, img: nombreArchivo })
        })
    })
}

function deleteFile(nombreImagen, tipo) {
    let pathImage = path.join(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }
}

module.exports = app