const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema({

    nome: {
        type: String,
        required: true
    },
    nomeAdicional: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    pais: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    seguidores: {
        type: Number
    }

})

mongoose.model("usuarios", Usuario)
