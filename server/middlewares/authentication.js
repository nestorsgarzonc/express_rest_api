const jwt = require('jsonwebtoken')

/////////////////////
//Verificar TOKEN
/////////////////////

let verificaToken = (req, res, next) => {
    let token = req.get('token')
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, err })
        }
        req.usuario = decoded.usuario
        next()
    })
    //res.json({ token })
}

let verificaAdminRole = (req, res, next) => {
    let user = req.usuario
    if (user.role !== 'ADMIN_ROLE') {
        return res.json({ ok: false, err: { message: 'El usuario no es admin' } })
    }
    next()
}

module.exports = { verificaToken, verificaAdminRole }