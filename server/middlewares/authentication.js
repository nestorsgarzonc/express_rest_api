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

let verificaFreelancerRole = (req, res, next) => {
    let user = req.usuario
    if (user.role !== 'FREELANCER') {
        return res.json({ ok: false, err: { message: 'El usuario no es freelancer' } })
    }
    next()
}

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ ok: false, err })
        }
        req.usuario = decoded.usuario
        next()
    })
}


module.exports = { verificaToken, verificaFreelancerRole, verificaTokenImg }