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
    endereco: {
        type: Schema.Types.ObjectId,
        ref: "enderecos"
    },
    ultimo_cargo: {
        type: String
    },
    ultima_empresa: {
        type: String
    },
    ultimo_contrato: {
        type: String
    },
    area: {
        type: String
    },
    preferencia_emprego: {
        type: String
    },
    procurando_emprego: {
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
    },
    novoUsuario: {
        type: Number,
        default: 0
    }

})

mongoose.model("usuarios", Usuario)
