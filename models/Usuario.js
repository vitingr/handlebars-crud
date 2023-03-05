const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema({

    logado: {
        type: Number,
        default: 1
    },
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    nomeCompleto: {
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
    },
    estado: {
        type: String,
    },
    cidade: {
        type: String,
    },
    escola: {
        type: String
    },
    faculdade: {
        type: String
    },
    foto: {
        type: String
    },
    area: {
        type: String
    },
    seguidores: {
        type: Number
    }

})

mongoose.model("usuarios", Usuario)
