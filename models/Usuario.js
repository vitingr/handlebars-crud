const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Usuario = new Schema({

    logado: {
        type: Number,
        default: 1
    },
    tipoConta: {
        type: String,
        default: "usuario",
        required: true
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
    amigos: {
        type: String
    },
    amigos_pendentes: {
        type: String
    },
    notificacoes: {
        type: Number,
        default: 0
    },
    paginas: {
        type: String
    },
    foto: {
        type: String
    },
    background: {
        type: String
    },
    seguidores: {
        type: Number
    },
    resumo: {
        type: String
    },
    cargo_atual: {
        type: String,
    },
    telefone: {
        type: String
    },
    website: {
        type: String
    },
    formacao: {
        type: Schema.Types.ObjectId,
        ref: "formacoes"
    },
    novoUsuario: {
        type: Number,
        default: 0
    }

})

mongoose.model("usuarios", Usuario)
