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
    endreco: {
        type: Schema.Types.ObjectId,
        ref: "enderecos"
    },
    ultimo_cargo: {
        type: String
    },
    ultimo_empresa: {
        type: String
    },
    ultimo_contrato: {
        type: String
    },
    area: {
        type: String
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
    seguidores: {
        type: Number
    }

})

mongoose.model("usuarios", Usuario)
