const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['FREELANCER', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    first_name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    last_name: {
        type: String,
        required: [true, 'los apellidos es necesario']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'El nombre de usuario es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    location: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        default: 'no seleccionado',
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    status: {
        type: Boolean,
        default: true
    }
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' })

module.exports = mongoose.model('Usuario', usuarioSchema)