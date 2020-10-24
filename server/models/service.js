const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const serviceSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    price: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    description: {
        type: String,
        required: false
    },
    isAvaliable: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria', required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    img: {
        type: String,
        required: false
    },
});


module.exports = mongoose.model('Service', serviceSchema);