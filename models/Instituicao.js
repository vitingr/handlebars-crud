const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Instituicao = new Schema({

    dono: {
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    website: {
        type: String
    },
    qtdFuncionarios: {
        type: String,
        required: true
    },
    industria: {
        type: String,
        required: true
    },
    descricao: {
        type: String
    },
    logo: {
        type: String
    }

})

mongoose.model("instituicoes", Instituicao)
